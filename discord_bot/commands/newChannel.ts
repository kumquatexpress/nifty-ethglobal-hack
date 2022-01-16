import Collection from "../../server/models/Collection.model";
import logger from "../../server/utils/logger";
import { Permissions, TextChannel, VoiceChannel } from "discord.js";
import client from "../client";

interface NewChannelOptions {
  type: "COLLECTION" | "INITIAL";
  channelType: "GUILD_TEXT" | "GUILD_VOICE";
  id?: string;
  parentCategoryId?: string;
}

export default async function newChannelForGuild(
  guildId: string,
  name: string,
  options: NewChannelOptions,
  canRead: boolean = false,
  canWrite: boolean = false
): Promise<TextChannel | VoiceChannel> {
  logger.info("newChannelForGuild", [
    guildId,
    name,
    canRead,
    canWrite,
    options,
  ]);
  const guild = await client.guilds.fetch(guildId);
  const perms = canWrite
    ? []
    : canRead
    ? [Permissions.FLAGS.SEND_MESSAGES]
    : [Permissions.FLAGS.VIEW_CHANNEL];
  const permissions: any = [
    {
      id: guild.me,
      allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES],
    },
    {
      id: guild.id,
      deny: perms,
    },
  ];
  // If a collection or event we add perms for messages or voice to a given role
  if (options.type !== "INITIAL") {
    const role = await guild.roles.create({
      name: `${name} Badge Holders`,
    });
    const rolePerms = [
      Permissions.FLAGS.VIEW_CHANNEL,
      Permissions.FLAGS.SEND_MESSAGES,
    ];
    if (options.channelType === "GUILD_VOICE") {
      rolePerms.push(Permissions.FLAGS.SPEAK);
    }
    permissions.push({
      id: role.id,
      allow: rolePerms,
    });
    if (options.type === "COLLECTION") {
      const collection = await Collection.findByPk(options.id);
      collection.discord_role_id = role.id;
      collection.save();
    }
  }

  const channel = await guild.channels.create(name, {
    type: options.channelType,
    permissionOverwrites: permissions,
    parent: options.parentCategoryId,
  });

  return channel;
}
