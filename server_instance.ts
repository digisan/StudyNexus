import homeRouter from "./routes/home.ts";
import userRouter from "./routes/user.ts";
import { Application, Router } from "jsr:@oak/oak";

async function main() {
    const app = new Application();
    const router = new Router();

    // ************************ AUTO GENERATED ************************ //
    router.use(homeRouter.routes(), homeRouter.allowedMethods());
    router.use(userRouter.routes(), userRouter.allowedMethods());
    // **************************************************************** //

    app.use(router.routes());
    app.use(router.allowedMethods());

    const port = 8001;
    console.log(`🚀 Server running on http://localhost:${port}`);
    await app.listen({ port: port });
}

main();
