import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("autoresponse")
    .setDescription("🐨 — Kustomisasi autoresponder mu")
    .addSubcommand(sub => sub.setName("create")
      .setDescription("🐨 — Buat autoresponder baru")
      .addStringOption(option => option.setName("tag")
        .setDescription("🐨 — Konten pesan untuk memanggil autorespon ini")
        .setMaxValues(512))
      .addStringOption(option => option.setName("response")
        .setDescription("🐨 — Konten pesan untuk merespon autorespon ini")
        .setMaxValues(512)))
    .setDMPermission(false),
  async execute(interaction) {
    if (!interaction.client.config.discord.moderators.includes(interaction.userId)) {
      return await interaction.reply({
        content: `[ Perintah hanya bisa dieksekusi admin bot ]`
      });
    } else {
      const subcommand = await interaction.options.getSubcommand();
      await interaction.reply({
        content: `[ Tidak ada perintah untuk dieksekusi ]`
      });
    }
  }
};
