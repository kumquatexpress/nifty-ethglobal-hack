import DiscordGuild from "../../server/models/DiscordGuild.model";
import newChannelForGuild from "../../discord_bot/commands/newChannel";
import sendInitialMessage from "../../discord_bot/commands/sendInitialMessage";
import newCategoryForGuild from "../../discord_bot/commands/newCategory";
import logger from "../../server/utils/logger";
import Collection from "../../server/models/Collection.model";
import redis from "../../server/utils/redis";

export interface InitializeDiscordServerRequest {
  guildId: string;
  userId: string;
}

export interface InitializeDiscordServerResponse {
  guildId: string;
  channelId: string;
}

export default async function InitializeDiscordServerTask(
  data: InitializeDiscordServerRequest
): Promise<InitializeDiscordServerResponse> {
  const guild = await DiscordGuild.findOne({
    where: {
      guild_id: data.guildId,
      user_id: data.userId,
    },
  });
  if (!guild) {
    return;
  }
  if (!guild.main_channel_id) {
    const category = await newCategoryForGuild(
      guild.guild_id,
      "NiftyHax Start Here"
    );
    const channel = await newChannelForGuild(
      guild.guild_id,
      "badge in here",
      {
        type: "INITIAL",
        channelType: "GUILD_TEXT",
        parentCategoryId: category.id,
      },
      true,
      false
    );
    guild.main_channel_id = channel.id;
  }
  if (!guild.collections_category_id) {
    const collectionsCategory = await newCategoryForGuild(
      guild.guild_id,
      "NiftyHax Collections"
    );
    guild.collections_category_id = collectionsCategory.id;
  }
  guild.save();
  try {
    await sendInitialMessage(guild.guild_id, guild.main_channel_id);
    const collections = await Collection.findAll({
      where: { user_id: data.userId },
    });
    console.log("collections", collections);
    await Promise.all(
      collections.map((c) => {
        if (!c.discord_guild_id) {
          redis.redisClient.rpush(
            redis.WORKER_LISTEN_QUEUE,
            JSON.stringify({
              type: redis.WORKER_MSG_QUEUES.syncCollectionToDiscord.name,
              request: {
                collectionId: c.id,
              },
            })
          );
        }
      })
    );
    return {
      guildId: guild.guild_id,
      channelId: guild.main_channel_id,
    };
  } catch (err) {
    logger.error("InitializeDiscordServerTask", [err]);
    return null;
  }
}
