import { Router } from "jsr:@oak/oak";

const router = new Router();
router.get("/", (ctx) => {
    ctx.response.body = { message: "Welcome to the Home Page!" };
});

export default router;
