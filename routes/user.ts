import { Router } from "jsr:@oak/oak";

const router = new Router();
router.get("/user", (ctx) => {
    ctx.response.body = { message: "User Route", users: ["Alice", "Bob"] };
});

export default router;
