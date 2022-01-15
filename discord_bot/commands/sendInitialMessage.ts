import {
  MessageActionRow,
  MessageButton,
  Permissions,
  TextChannel,
} from "discord.js";
import config from "../../config";
import logger from "../../server/utils/logger";
import client from "../client";

const initialMessage = [
  `Welcome to this Discord server, managed by NiftyBadger! Here's what you have to do to get access to channels:`,
  ``,
  `Clicking the link below will take you to a niftybadger.io url. If you're already logged in, we'll check your wallet for any NFT badges that unlock a channel`,
  `and then add you to them! If you're not logged into NiftyBadger, you'll have to link your wallet to create an account (it's all public and read-only).`,
  ``,
  `Once you've connected your account, we'll periodically check and add you to any new channels you have access to - both in this server and in any Discord server that uses our bot!`,
].join("\n");

const buttonLink = `${config.discord.CONNECT_URI}`;

export default async function sendInitialMessage(
  guildId: string,
  channelId: string
): Promise<boolean> {
  logger.info("sendInitialMessage", [guildId, channelId]);
  const guild = await client.guilds.fetch(guildId);
  const channel = (await guild.channels.fetch(channelId)) as TextChannel;
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setLabel("Niftily connect your account")
      .setStyle("LINK")
      .setURL(buttonLink)
  );
  await channel.send({ content: initialMessage, components: [row] });
  return true;
}
