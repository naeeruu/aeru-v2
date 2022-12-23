import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("autoresponse")
    .setDescription("🐨 — Kustomisasi autoresponder mu")
    .addSubcommand(sub => sub.setName("create")
      .setDescription("🐨 — Buat autoresponder baru")
      .addStringOption(option => option.setName("tag")
        .setDescription("🐨 — Konten pesan untuk memanggil autorespon ini")
        .setMaxLength(512))
      .addStringOption(option => option.setName("response")
        .setDescription("🐨 — Konten pesan untuk merespon autorespon ini")
        .setMaxLength(512)))
    .setDMPermission(false),
  async execute(interaction) {
    if (!interaction.client.config.discord.moderators.includes(interaction.user.id)) {
      return await interaction.reply({
        content: `[ Perintah hanya bisa dieksekusi admin bot ]`
      });
    } else {
      const subcommand = await interaction.options.getSubcommand();
      await interaction.deferReply();

      switch (subcommand) {
        case "create":
          const tag = await interaction.options.getString("tag");
          const response = await interaction.options.getString("response");

          const data = await interaction.client.mongo.db("autoresponse").find().toArray().find(data => data.tag.toLowerCase() === tag.toLowerCase());
          if (data) {
            return await interaction.editReply({
              embeds: [
                new EmbedBuilder.from(interaction.client.config.discord.embed)
                  .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                  .setDescription(`Autoresponder dengan tag ini sudah ada~ (\\*\\´ω\\｀\\*) [\`#${data._id}\`]`)
                  .setFields(
                    { name: "Tag~", value: data.tag },
                    { name: "Respon~", value: data.response }
                  )
                  .setFooter({ text: `Dibuat oleh ${data.creator.username} chan~ (${data.creator.id})` });
              ]
            });
          } else {
            
          }
        break;
      }
    }
  }
};
