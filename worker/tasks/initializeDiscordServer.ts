import DiscordGuild from "../../server/models/DiscordGuild.model";
import newChannelForGuild from "../../discord_bot/commands/newChannel";
import sendInitialMessage from "../../discord_bot/commands/sendInitialMessage";
import newCategoryForGuild from "../../discord_bot/commands/newCategory";
import logger from "../../server/utils/logger";

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
      "NiftyBadgers Start Here"
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
  if (!guild.event_category_id) {
    const eventsCategory = await newCategoryForGuild(
      guild.guild_id,
      "NiftyBadger Events"
    );
    guild.event_category_id = eventsCategory.id;
  }
  if (!guild.collections_category_id) {
    const collectionsCategory = await newCategoryForGuild(
      guild.guild_id,
      "NiftyBadger Collections"
    );
    guild.collections_category_id = collectionsCategory.id;
  }

  guild.save();
  try {
    await sendInitialMessage(guild.guild_id, guild.main_channel_id);
    return {
      guildId: guild.guild_id,
      channelId: guild.main_channel_id,
    };
  } catch (err) {
    logger.error("InitializeDiscordServerTask", [err]);
    return null;
  }
}
