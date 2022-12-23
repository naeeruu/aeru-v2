import { client } from "../main.js";

export default {
  class: client,
  async execute(message) {
    if (message.author.bot) return;

    const { timestamp } = await message.client.mongo.db("client").collection("conn").findOne({ _id: message.client.id });
    if (timestamp !== message.client.readyTimestamp) return await process.exit(0);
  }
};
