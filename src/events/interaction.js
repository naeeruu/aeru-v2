import { Events } from "discord.js";

export default {
  name: Events.InteractionCreate,
  async execute(interaction) {
    const { timestamp } = await client.mongo.db("client").collection("conn").findOne({ _id: interaction.client.id });
    if (timestamp !== interaction.client.readyTimestamp) return await process.exit(0);
  }
};
