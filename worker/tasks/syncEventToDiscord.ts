import Event from "../../server/models/Event.model";
import DiscordGuild from "../../server/models/DiscordGuild.model";
import newChannelForGuild from "../../discord_bot/commands/newChannel";
import User from "../../server/models/User.model";

export interface SyncEventToDiscordRequest {
  eventId: string;
}

export interface SyncEventToDiscordResponse {
  channelMapping: any;
}

export default async function SyncEventToDiscordTask(
  data: SyncEventToDiscordRequest
): Promise<SyncEventToDiscordResponse> {
  const event = await Event.findByPk(data.eventId, { include: User });
  if (!event || !event.user) {
    return;
  }
  if (!event.discord_guild_id) {
    const discordGuilds = await event.user.$get("discord_guilds");
    if (discordGuilds.length === 0) {
      return;
    }
    event.discord_guild_id = discordGuilds[0].guild_id;
    event.save();
  }
  const guild = await DiscordGuild.findOne({
    where: {
      guild_id: event.discord_guild_id,
      user_id: event.user_id,
    },
  });
  if (!guild) {
    return;
  }
  const channel = await newChannelForGuild(
    event.discord_guild_id,
    event.name,
    {
      type: "EVENT",
      channelType: "GUILD_VOICE",
      parentCategoryId: guild.event_category_id,
      id: event.id,
    },
    false,
    false
  );
  guild.channel_mapping = {
    ...guild.channel_mapping,
    [channel.id]: event.id,
    [event.id]: channel.id,
  };
  guild.save();
  return {
    channelMapping: guild.channel_mapping,
  };
}
