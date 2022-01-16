"use strict";
import Router from "koa-router";
import authRouter from "./auth";
import fetch from "node-fetch";
import config from "../../config";
import logger from "../utils/logger";
import Collection from "../models/Collection.model";
import LivepeerCollections from "../models/LivepeerCollections.model";
import redis from "../utils/redis";

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

apiRouter.get("/collection/:collectionId/status", async (ctx, next) => {
  const { collectionId } = ctx.params;

  let collection: Collection = await Collection.findByPk(collectionId);
  if (collection == null) {
    ctx.status = 404;
    return next();
  } else {
    ctx.status = 200;
    ctx.body = {
      status: collection.status,
    };
  }
});

/*
  "name": "test_stream",
  "profiles": [
    {
      "name": "720p",
      "bitrate": 2000000,
      "fps": 30,
      "width": 1280,
      "height": 720
    },
    {
      "name": "480p",
      "bitrate": 1000000,
      "fps": 30,
      "width": 854,
      "height": 480
    },
    {
      "name": "360p",
      "bitrate": 500000,
      "fps": 30,
      "width": 640,
      "height": 360
    }
  ]

  Returns
  {
    "name":"test_stream",
    "profiles":[
        {"name":"720p","bitrate":2000000,"fps":30,"width":1280,"height":720},
        {"name":"480p","bitrate":1000000,"fps":30,"width":854,"height":480}],
        {"name":"360p","bitrate":500000,"fps":30,"width":640,"height":360}],
    "id":"ijkl61f3-95bd-4971-a7b1-4dcb5d39e78a",
    "createdAt":1596081229373,
    "streamKey":"abcd-uimq-jtgy-x98v",
    "playbackId":"efghb2mxupongp5k",
    {other asset object keys}
  }
*/
apiRouter.post("/livepeerStream", async (ctx, next) => {
  const { name, profiles, collectionIds } = ctx.request.body;

  const collections = await Collection.findAll({
    where: { id: collectionIds },
  });
  if (collections.some((c) => c.user_id !== ctx.state.user.id)) {
    ctx.status = 401;
    return next();
  }
  try {
    const createStreamResponse = await fetch(
      "https://livepeer.com/api/stream",
      {
        method: "POST",
        body: JSON.stringify({
          name,
          profiles,
        }),
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${config.livepeer.API_KEY}`,
        },
      }
    );

    if (createStreamResponse) {
      const body = await createStreamResponse.json();

      await Promise.all(
        collections.map((c) => {
          return LivepeerCollections.create({
            livepeer_stream_id: body.id,
            collection_id: c.id,
            user_id: ctx.state.user.id,
          });
        })
      );
      await redis.redisClient.rpush(
        redis.WORKER_LISTEN_QUEUE,
        JSON.stringify({
          type: redis.WORKER_MSG_QUEUES.hypeLivestreamToDiscord.name,
          request: {
            collectionIds: collections.map((c) => c.id),
            userId: ctx.state.user.id,
            livestreamId: body.id,
          },
        })
      );
      ctx.status = 200;
      ctx.body = body;
    }
  } catch (e) {
    logger.error("Livepeer error", [e]);
  }
});
apiRouter.post("/livepeerStream/fetch", async (ctx, next) => {
  const { streamId } = ctx.request.body;
  const streamResponse = await fetch(
    `https://livepeer.com/api/stream/${streamId}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.livepeer.API_KEY}`,
      },
    }
  );
  const body = await streamResponse.json();
  const lc = await LivepeerCollections.findOne({
    where: {
      livepeer_stream_id: streamId,
    },
  });
  if (lc.user_id !== ctx.state.user.id) {
    body["streamKey"] = null;
  }
  ctx.status = streamResponse.status;
  ctx.body = body;
});
apiRouter.use(authRouter.routes(), authRouter.allowedMethods());

export default apiRouter;
