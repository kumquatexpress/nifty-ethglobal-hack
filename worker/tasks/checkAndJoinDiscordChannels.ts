// import config from "../../config";
// import Collection from "../../server/models/Collection.model";
// import Web3PublicKey from "../../server/models/Web3PublicKey.model";
// import User from "../../server/models/User.model";
// import { pl8, pl13 } from "../../server/utils/helpers";
// import { getTokensOwnedByAccount } from "../../server/utils/smart_contracts/toolbox/machine";
// import modifyUserInChannel from "../../discord_bot/commands/modifyUserInChannel";
// import logger from "../../server/utils/logger";

// export interface CheckAndJoinDiscordChannelsRequest {
//   guildId: string;
//   userId: string;
// }

// export interface CheckAndJoinDiscordChannelsResponse {
//   added: string[];
//   removed: string[];
// }

// export default async function CheckAndJoinDiscordChannelsTask(
//   data: CheckAndJoinDiscordChannelsRequest
// ): Promise<CheckAndJoinDiscordChannelsResponse> {
//   logger.info("CheckAndJoinDiscordChannelsTask", [data]);
//   const user = await User.findByPk(data.userId, {
//     include: Web3PublicKey,
//   });
//   const collections = await Collection.findAll({
//     where: {
//       discord_guild_id: data.guildId,
//     },
//   });
//   if (!user || !user.discord_user_id || collections.length == 0) {
//     return null;
//   }

//   // create {id : collection} mapping for lookup later
//   const collectionsById = collections.reduce(
//     (map: { [k: string]: Collection }, c: Collection) => {
//       map[c.id] = c;
//       return map;
//     },
//     {}
//   );

//   // check the user's access to each of the collections in this guild
//   const ownedTokens = await getTokensOwnedByAccount(user.public_key.key);
//   const resultsPromise = await Promise.allSettled(
//     Object.keys(collectionsById).map((collId) => {
//       const collection = collectionsById[collId];
//       return pl13(async () => ({
//         id: collection.id,
//         data: await collection.getNFTsMatchingOwnedTokens(ownedTokens),
//       }));
//     })
//   );
//   const results = resultsPromise
//     .filter((m) => m.status === "fulfilled")
//     .map((m) => (m as any).value);

//   const completedIds = {};

//   await Promise.allSettled(
//     results.map(async (result) =>
//       pl8(async () => {
//         console.log("result", result);
//         const collection = collectionsById[result.id];
//         const roleId = collection.discord_role_id;
//         if (completedIds[roleId]) {
//           return;
//         }
//         if (result.data.length > 0) {
//           await modifyUserInChannel(
//             roleId,
//             data.guildId,
//             user.discord_user_id,
//             "ADD"
//           );
//         } else {
//           await modifyUserInChannel(
//             roleId,
//             data.guildId,
//             user.discord_user_id,
//             "REMOVE"
//           );
//         }
//       })
//     )
//   );
// }
