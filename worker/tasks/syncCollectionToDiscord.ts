import Collection from "../../server/models/Collection.model";
import DiscordGuild from "../../server/models/DiscordGuild.model";
import newChannelForGuild from "../../discord_bot/commands/newChannel";
import User from "../../server/models/User.model";

export interface SyncCollectionToDiscordRequest {
  collectionId: string;
}

export interface SyncCollectionToDiscordResponse {
  channelMapping: any;
}

export default async function SyncCollectionToDiscordTask(
  data: SyncCollectionToDiscordRequest
): Promise<SyncCollectionToDiscordResponse> {
  const collection = await Collection.findByPk(data.collectionId, {
    include: User,
  });
  if (!collection || !collection.user) {
    return;
  }
  if (!collection.discord_guild_id) {
    const discordGuilds = await collection.user.$get("discord_guilds");
    if (discordGuilds.length === 0) {
      return;
    }
    collection.discord_guild_id = discordGuilds[0].guild_id;
    collection.save();
  }
  const guild = await DiscordGuild.findOne({
    where: {
      guild_id: collection.discord_guild_id,
      user_id: collection.user_id,
    },
  });
  if (!guild) {
    return;
  }
  const channel = await newChannelForGuild(
    collection.discord_guild_id,
    collection.name,
    {
      type: "COLLECTION",
      channelType: "GUILD_TEXT",
      parentCategoryId: guild.collections_category_id,
      id: collection.id,
    },
    false,
    false
  );
  guild.channel_mapping = {
    ...guild.channel_mapping,
    [channel.id]: collection.id,
    [collection.id]: channel.id,
  };
  guild.save();
  return {
    channelMapping: guild.channel_mapping,
  };
}
