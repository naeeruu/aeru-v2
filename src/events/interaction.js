import { ApplicationCommandType } from "discord.js";

export default {
  class: "DiscordClient",
  async execute(interaction) {
    const { timestamp } = await interaction.client.mongo.db("client").collection("conn").findOne({ _id: interaction.client.id });
    if (timestamp !== interaction.client.readyTimestamp) return await process.exit(0);

    if (interaction.isCommand()) {
      const command = await interaction.client.commands.find(command => command.data.name === interaction.commandName && command.data.type === (interaction.commandType === ApplicationCommandType.ChatInput ? undefined : interaction.commandType));
      if (command) return await command.execute(interaction);
    }
  }
};
