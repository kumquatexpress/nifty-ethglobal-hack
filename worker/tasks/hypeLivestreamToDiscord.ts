import Config from "../../config";
import sendHypeMessage from "../../discord_bot/commands/sendHypeMessage";
import Collection from "../../server/models/Collection.model";
import DiscordGuild from "../../server/models/DiscordGuild.model";

export interface HypeLivestreamToDiscordRequest {
  collectionIds: string[];
  userId: string;
  livestreamId: string;
}

export interface HypeLivestreamToDiscordResponse {}

export default async function HypeLivestreamToDiscordTask(
  data: HypeLivestreamToDiscordRequest
): Promise<HypeLivestreamToDiscordResponse> {
  const collection = await Collection.findOne({
    where: {
      id: data.collectionIds,
    },
  });
  const livestreamUrl = `${Config.app.CLIENT_HOSTNAME}/livestream/${data.livestreamId}`;
  const discordGuild = await DiscordGuild.findOne({
    where: {
      guild_id: collection.discord_guild_id,
      user_id: data.userId,
    },
  });
  data.collectionIds.forEach(async (cid) => {
    const channelId = discordGuild.channel_mapping[cid];
    if (channelId) {
      await sendHypeMessage(discordGuild.guild_id, channelId, livestreamUrl);
    }
  });
  return {};
}
