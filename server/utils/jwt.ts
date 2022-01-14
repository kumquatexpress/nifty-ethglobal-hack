import jwt from "jsonwebtoken";
import { RouterContext } from "koa-router";
import config from "../../config";
import User from "../models/User.model";

export function setJwtHeaderOnLogin(ctx: RouterContext, user: User) {
  const newToken = jwt.sign({ userId: user.id }, config.auth.JWT_SECRET, {
    expiresIn: "30d",
  });
  ctx.body = {
    access_token: newToken,
    token_type: "Bearer",
  };
}

export function setJwtHeader(ctx: RouterContext) {
  setJwtHeaderOnLogin(ctx, ctx.state.user);
}

export function verifyJwt(token: string): string {
  try {
    const user = jwt.verify(token, config.auth.JWT_SECRET);
    return user["userId"];
  } catch (err) {
    //
  }
}
