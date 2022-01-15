import { GuildMember } from "discord.js";
import logger from "../../server/utils/logger";
import client from "../client";

export default async function modifyUserInChannel(
  roleId: string,
  guildId: string,
  discordUserId: string,
  action: "ADD" | "REMOVE"
): Promise<GuildMember> {
  logger.info("modifyUserInChannel", [roleId, guildId, discordUserId, action]);
  const guild = await client.guilds.fetch(guildId);
  const member = await guild.members.fetch(discordUserId);
  if (action === "ADD") {
    await member.roles.add(roleId);
  } else {
    await member.roles.remove(roleId);
  }
  return member;
}
