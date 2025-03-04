import { Application, Router } from "jsr:@oak/oak";

async function main() {

    const app = new Application();
    const router = new Router();

    // ************************ AUTO GENERATED ************************ //
    // ROUTER.USE... //
    // **************************************************************** //

    app.use(router.routes());
    app.use(router.allowedMethods());

    const port = 8001;
    console.log(`🚀 Server running on http://localhost:${port}`);
    await app.listen({ port: port });
}

main();