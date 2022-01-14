"use strict";
import config from "../../config";
import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

const WORKER_LISTEN_QUEUE = "badger_worker_listen";
const WORKER_MSG_QUEUES = {
  createItemsFromTemplate: {
    name: "createItemsFromTemplate",
    receive: "recv_create_images_from_template",
  },
  addItemsToMachine: {
    name: "addItemsToMachine",
    receive: "recv_add_items_to_machine",
  },
  syncCollectionToDiscord: {
    name: "syncCollectionToDiscord",
    receive: "recv_sync_collection_to_discord",
  },
  initializeDiscordServer: {
    name: "initializeDiscordServer",
    receive: "recv_initialize_discord_server",
  },
  checkAndJoinDiscordChannels: {
    name: "checkAndJoinDiscordChannels",
    receive: "recv_check_and_join_discord_channels",
  },
  syncEventToDiscord: {
    name: "syncEventToDiscord",
    receive: "recv_sync_event_to_discord",
  },
};

const redisOptions = config.redis.URL || {
  host: config.redis.HOST,
  port: config.redis.PORT,
  family: 4,
  password: config.redis.PASSWORD,
};
const redisClient: Redis = new Redis(redisOptions);

const pubsub = new RedisPubSub({
  publisher: new Redis(redisOptions),
  subscriber: new Redis(redisOptions),
});

export default { redisClient, WORKER_MSG_QUEUES, WORKER_LISTEN_QUEUE, pubsub };
