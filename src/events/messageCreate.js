import { Events } from "discord.js";
import config from "../config.json" assert { type: "json" };

export default {
  async execute(message) {
    if (message.author.bot) return;

    const { timestamp } = await message.client.mongo.db("client").collection("conn").findOne({ _id: message.client.id });
    if (timestamp !== message.client.readyTimestamp) return await process.exit(0);
  }
};
