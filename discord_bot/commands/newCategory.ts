import { CategoryChannel, Permissions } from "discord.js";
import logger from "../../server/utils/logger";
import client from "../client";

export default async function newCategoryForGuild(
  guildId: string,
  name: string
): Promise<CategoryChannel> {
  logger.info("newCategoryForGuild", [guildId, name]);
  const guild = await client.guilds.fetch(guildId);
  const channel = await guild.channels.create(name, {
    type: "GUILD_CATEGORY",
  });
  return channel;
}
