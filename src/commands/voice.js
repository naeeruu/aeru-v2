import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("voice")
    .setDescription("Manage and modify your voice channel")
    .addSubcommand(sub => sub.setName("lock")
      .setDescription("Lock your voice channel")),
  async execute(interaction) {
    await interaction.deferReply();
    if (!interaction.member.voice.channel) return await interaction.editReply({
      content: ``
    });
  }
};
