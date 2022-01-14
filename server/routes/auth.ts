"use strict";
import Router, { RouterContext } from "koa-router";
import nacl from "tweetnacl";
import Base58 from "base-58";
import fetch from "node-fetch";
import { TextEncoder } from "util";
import { URLSearchParams } from "url";

import passport from "../utils/passport";
import { setJwtHeaderOnLogin } from "../utils/jwt";
import { Next } from "koa";
import config from "../../config";
import User from "../models/User.model";
import Web3PublicKey from "../models/Web3PublicKey.model";
import DiscordGuild from "../models/DiscordGuild.model";
import redis from "../utils/redis";
import logger from "../utils/logger";

const authRouter = new Router({
  prefix: "/auth",
});
const ENCRYPTED_MSG = `Open sesame!`;

/* AUTH */
const _authFunc = (strat: string) => {
  return async (ctx: RouterContext, next: Next) => {
    return passport.authenticate(strat, (err: Error, user: User) => {
      if (!user) {
        ctx.body = err;
        ctx.throw(401);
      } else {
        ctx.status = 200;
        setJwtHeaderOnLogin(ctx, user);
        return;
      }
    })(ctx, next);
  };
};

authRouter.get("/current_user", async (ctx, next) => {
  return passport.authenticate("jwt", (err: Error, user: User) => {
    ctx.body = {
      user: user,
      token: ctx.request.headers["authorization"],
    };
    ctx.status = 200;
    next();
  })(ctx, next);
});
authRouter.post("/create", async (ctx, next) => {
  // password is a Buffer, key is a base58 encoded string
  const { password, key } = ctx.request.body;
  const enc = new TextEncoder();
  if (
    nacl.sign.detached.verify(
      enc.encode(ENCRYPTED_MSG),
      new Uint8Array(password.data),
      Base58.decode(key)
    )
  ) {
    try {
      return await Web3PublicKey.findByPk(key).then(async (account) => {
        if (account) {
          return _authFunc("local")(ctx, next);
        } else {
          // Create account object
          const newUser = await User.create();
          await Web3PublicKey.create({
            key: key,
            user_id: newUser.id,
          });
          return _authFunc("local")(ctx, next);
        }
      });
    } catch (err) {
      logger.error("/create", [err]);
    }
  } else {
    ctx.throw(401);
  }
});
authRouter.post("/facebook", _authFunc("facebook-token"));
authRouter.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  })
);
authRouter.get("/facebook/callback", _authFunc("facebook"));
authRouter.post("/discord", async (ctx, next) => {
  const { code, guildId } = ctx.request.body;
  // First get access token in exchange for code
  const data = new URLSearchParams();
  data.set("client_id", config.discord.CLIENT_ID);
  data.set("client_secret", config.discord.CLIENT_SECRET);
  data.set("grant_type", "authorization_code");
  data.set("code", code);
  data.set(
    "redirect_uri",
    `${config.app.CLIENT_HOSTNAME}${config.discord.REDIRECT_URI}`
  );
  let resp = await fetch("https://discord.com/api/v9/oauth2/token", {
    method: "POST",
    // @ts-ignore
    body: data,
  });
  const token = await resp.json();
  const headers = {
    Authorization: `Bearer ${token["access_token"]}`,
  };
  // Then fetch the user's guilds
  resp = await fetch("https://discord.com/api/v9/users/@me/guilds", {
    method: "GET",
    headers: headers,
  });

  // Check the guilds to make sure this guild id is one that the user owns
  const allGuilds: any[] = await resp.json();
  let isOwner = false;
  allGuilds.forEach((guildObj) => {
    if (guildObj.id === guildId) {
      isOwner = guildObj.owner;
    }
  });
  // Then create or get the model in db matching user -> discord guild
  if (isOwner) {
    const existing = await DiscordGuild.findOne({
      where: {
        user_id: ctx.state.user.id,
        guild_id: guildId,
      },
    });
    if (!existing) {
      await DiscordGuild.create({
        guild_id: guildId,
        user_id: ctx.state.user.id,
      });
    }
    await redis.redisClient.rpush(
      redis.WORKER_LISTEN_QUEUE,
      JSON.stringify({
        type: redis.WORKER_MSG_QUEUES.initializeDiscordServer.name,
        request: {
          guildId: guildId,
          userId: ctx.state.user.id,
        },
      })
    );
    ctx.status = 200;
    next();
  } else {
    ctx.status = 403;
    ctx.body = "Unauthorized";
    next();
  }
});
authRouter.post("/discord/connect", async (ctx, next) => {
  const { code, guildId } = ctx.request.body;
  // First get access token in exchange for code
  const data = new URLSearchParams();
  data.set("client_id", config.discord.CLIENT_ID);
  data.set("client_secret", config.discord.CLIENT_SECRET);
  data.set("grant_type", "authorization_code");
  data.set("code", code);
  data.set(
    "redirect_uri",
    `${config.app.CLIENT_HOSTNAME}${config.discord.USER_REDIRECT_URI}`
  );
  console.log("data", data);
  let resp = await fetch("https://discord.com/api/v9/oauth2/token", {
    method: "POST",
    // @ts-ignore
    body: data,
  });
  const token = await resp.json();
  console.log("token", token);
  const headers = {
    Authorization: `Bearer ${token["access_token"]}`,
  };
  // Then fetch the user
  resp = await fetch("https://discord.com/api/v9/users/@me", {
    method: "GET",
    headers: headers,
  });
  const userResp = await resp.json();
  const user = await User.findByPk(ctx.state.user.id);
  user.discord_user_id = userResp.id;
  user.save();

  // Then fetch the user's guilds
  resp = await fetch("https://discord.com/api/v9/users/@me/guilds", {
    method: "GET",
    headers: headers,
  });

  // Check the guilds to make sure this guild id is one that the user owns
  const allGuilds: any[] = await resp.json();
  await Promise.allSettled(
    allGuilds.map((guildObj) =>
      redis.redisClient.rpush(
        redis.WORKER_LISTEN_QUEUE,
        JSON.stringify({
          type: redis.WORKER_MSG_QUEUES.checkAndJoinDiscordChannels.name,
          request: {
            guildId: guildObj.id,
            userId: user.id,
          },
        })
      )
    )
  );
  ctx.status = 200;
  next();
});

export default authRouter;
