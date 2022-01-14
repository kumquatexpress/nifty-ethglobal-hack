"use strict";
import Router from "koa-router";
import authRouter from "./auth";

const apiRouter = new Router({
  prefix: "/api",
});
apiRouter.get("/status", async (ctx, next) => {
  ctx.body = {
    status: "ok",
  };
  ctx.status = 200;
  next();
});
apiRouter.use(authRouter.routes(), authRouter.allowedMethods());

export default apiRouter;
