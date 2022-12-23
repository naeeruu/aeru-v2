import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Tes sinyal🌂"),
  async execute(interaction) {
    await interaction.reply({
      content: `Ehe! (≡^∇^≡) ${Date.now() - interaction.createdTimestamp}ms`
    });
  }
};
