import { MessageActionRow, MessageButton, TextChannel } from "discord.js";
import logger from "../../server/utils/logger";
import client from "../client";

const initialMessage = [
  `Thanks for being a badge holder!! You're invited to a livestream happening right now, click below to join the fun!`,
].join("\n");

export default async function sendHypeMessage(
  guildId: string,
  channelId: string,
  livestreamUrl: string
): Promise<boolean> {
  logger.info("sendHypeMessage", { guildId, channelId, livestreamUrl });
  const guild = await client.guilds.fetch(guildId);
  const channel = (await guild.channels.fetch(channelId)) as TextChannel;
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setLabel("Join the hype train")
      .setStyle("LINK")
      .setURL(livestreamUrl)
  );
  await channel.send({ content: initialMessage, components: [row] });
  return true;
}
