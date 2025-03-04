import { parseArgs } from "jsr:@std/cli/parse-args";

// 修改 server.ts 文件
async function genServerInstanceFile() {
    const args = parseArgs(Deno.args);

    let inServerFile = args.in ?? "./server.ts";
    inServerFile = inServerFile.endsWith(".ts")
        ? inServerFile
        : `${inServerFile}.ts`;

    (async () => {
        try {
            await Deno.stat(inServerFile);
        } catch {
            console.error(`Error: "${inServerFile}" is not existing`);
            Deno.exit(1);
        }
    })();

    let outServerFile = args.out ?? "./server_instance.ts";
    outServerFile = outServerFile.endsWith(".ts")
        ? outServerFile
        : `${outServerFile}.ts`;

    const routeFiles = await (async () => {
        const routeDir = args.routes ?? "./routes";
        const routeFiles = [];
        for await (const dirEntry of Deno.readDir(routeDir)) {
            if (dirEntry.isFile && dirEntry.name.endsWith(".ts")) {
                routeFiles.push(dirEntry.name);
            }
        }
        return routeFiles;
    })();

    // 读取 server.ts 文件内容
    let serverFileContent = await Deno.readTextFile(inServerFile);

    // 在文件顶部添加所有路由的 import 语句
    const importStatements = routeFiles.map((file) => {
        const routeName = file.replace(".ts", ""); // 去掉 .ts 后缀
        return `import ${routeName}Router from "./routes/${file}";`;
    }).join("\n");

    // 在文件中间添加所有路由的注册语句
    const routerUseStatements = routeFiles.map((file) => {
        const routeName = file.replace(".ts", "");
        return `router.use(${routeName}Router.routes(), ${routeName}Router.allowedMethods());`;
    }).join("\n");

    // 1. 将 import 语句插入到 server.ts 文件的合适位置
    serverFileContent = `
${importStatements}
${serverFileContent}
  `;

    //2. 将 router.use 语句插入到 server.ts 文件的合适位置
    serverFileContent = serverFileContent.replaceAll(
        `// ROUTER.USE... //`,
        routerUseStatements,
    );

    // 写回修改后的 server.ts 文件
    await Deno.writeTextFile(outServerFile, serverFileContent);

    // 格式化输出文件
    const fmt = new Deno.Command("deno", {
        args: ["fmt", outServerFile],
    });
    const fmtProcess = await fmt.output();
    if (!fmtProcess.success) {
        console.error(
            `❌ 格式化失败:`,
            new TextDecoder().decode(fmtProcess.stderr),
        );
    }
    console.log("server.ts has been modified successfully!");
}

// 执行修改
await genServerInstanceFile();
