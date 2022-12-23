import { Events } from "discord.js";
import config from "../config.json" assert { type: "json" };

export default {
  async execute(message) {
    if (message.author.bot) return;

    const { timestamp } = await message.client.mongo.db("client").collection("conn").findOne({ _id: message.client.id });
    if (timestamp !== message.client.readyTimestamp) return await process.exit(0);

    const prefix = (await message.client.mongo.db("prefix").collection(message.guildId).findOne({ _id: message.guildId }))?.data ?? defaultPrefix;
    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const command = await client.commands.find(command => command.data.name === args.shift());

      if (command) return await command.execute({ args, command, message, prefix });
    }
  }
};
