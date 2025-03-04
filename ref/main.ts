import { Application, Router } from "jsr:@oak/oak";

import homeRouter from "../routes/home.ts";
import userRouter from "../routes/user.ts";

// 动态导入路由
// async function loadRoutes(router: Router) {
//     for await (const entry of Deno.readDir("./routes")) {
//         if (entry.isFile && entry.name.endsWith(".ts")) {
//             const modulePath = `./routes/${entry.name}`;
//             const routeModule = await import(modulePath);

//             if (routeModule.default) {
//                 console.log(`✅ Loaded route: ${modulePath}`);
//                 router.use(routeModule.default.routes());
//                 router.use(routeModule.default.allowedMethods());
//             }
//         }
//     }
// }

async function main() {
    const app = new Application();
    const router = new Router();

    // 动态导入路由
    // await loadRoutes(router);

    router.use(homeRouter.routes(), homeRouter.allowedMethods());
    router.use(userRouter.routes(), userRouter.allowedMethods());

    app.use(router.routes());
    app.use(router.allowedMethods());

    console.log("🚀 Server running on http://localhost:8000");
    await app.listen({ port: 8000 });
}

main();
