"use strict";
import Router from "koa-router";

const webRouter = new Router();

webRouter.get("/", function (ctx, next) {
    ctx.body = "Hello world!";
    next();
});

export default webRouter;
