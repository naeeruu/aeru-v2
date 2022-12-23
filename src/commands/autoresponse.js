import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("autoresponse")
    .setDescription("🐨 — Kustomisasi autoresponder mu(*´ω｀*)")
    .addSubcommand(sub => sub.setName("create")
      .setDescription("🐨 — Buat autoresponder baru(*´ω｀*)")
      .addStringOption(option => option.setName("tag")
        .setDescription("🐨 — Konten pesan untuk memanggil autorespon ini")
        .setMaxLength(512))
      .addStringOption(option => option.setName("response")
        .setDescription("🐨 — Konten pesan untuk merespon autorespon ini")
        .setMaxLength(512)))
    .addSubcommand(sub => sub.setName("list")
      .setDescription("🐨 — Lihat daftar autoresponder(*´ω｀*)")
      .addNumberOption(option => option.setName("page")
        .setDescription("🐨 — Halaman autoresponder")
        .setMinValues(1)))
    .setDMPermission(false),
  async execute(interaction) {
    if (!interaction.client.config.discord.moderators.includes(interaction.user.id)) {
      return await interaction.reply({
        content: `[ Perintah hanya bisa dieksekusi admin bot ]`
      });
    } else {
      const subcommand = await interaction.options.getSubcommand();
      await interaction.deferReply();

      const data = await interaction.client.mongo.db("autoresponse").collection(interaction.guildId);
      switch (subcommand) {
        case "create":
          const tag = await interaction.options.getString("tag");
          const response = await interaction.options.getString("response");

          const autoresponses = (await data.find().toArray());
          const autoresponse = autoresponses.find(data => data.tag.toLowerCase() === tag.toLowerCase());
          if (autoresponse) {
            return await interaction.editReply({
              embeds: [
                EmbedBuilder.from(interaction.client.config.discord.embed)
                  .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                  .setDescription(`Autoresponder dengan tag ini sudah ada~ (\\*\\´ω\\｀\\*) [\`${autoresponse._id}\`]\n\\* Gunakan \`\/autoresponse delete id\:${autoresponse._id}\` untuk menghapus autoresponse ini`)
                  .setFields(
                    { name: "Tag~", value: autoresponse.tag, inline: true },
                    { name: "Respon~", value: autoresponse.response, inline: true }
                  )
                  .setFooter({ text: `Dibuat oleh ${autoresponse.creator.username} chan~ (${autoresponse.creator.id})` })
              ]
            });
          } else {
            try {
              const { insertedId } = await data.insertOne({ tag, response, creator: { username: interaction.user.username, id: interaction.user.id } });
              await interaction.editReply({
                embeds: [
                  EmbedBuilder.from(interaction.client.config.discord.embed)
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                    .setDescription(`Autorespon baru telah ditambahkan! (\\*\\´ω\\｀\\*)\n[\`${insertedId}\`]`)
                    .setFields(
                      { name: "Tag~", value: tag, inline: true },
                      { name: "Respon~", value: response, inline: true }
                    )
                ]
              });
            } catch(error) {
              console.error(error);
            }
          }
        break;
        case "list":
          const page = await interaction.options.getNumber("page");
          const autoresponseList = await data.find().toArray();
          const display = autoresponseList.filter((index) => index >= (page - 1) * 24 && index <= (page * 24));

          if (display.length === 0) {
            const lastPageIndex = autoresponseList.length / 25;
            const lastPage = lastPageIndex > Math.floor(lastPageIndex) ? Math.floor(lastPageIndex) + 1 : lastPageIndex;
            return await interaction.editReply({
              content: `Halaman terakhir autoresponder adalah ${lastPage.toLocaleString()}`
            })
          } else {
            return await interaction.editReply({
              embeds: [
                EmbedBuilder.from(interaction.client.config.discord.color)
                  .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                  .setDescription(`Inilah daftar autoresponder yang ada pada halaman ${page.toLocaleString()}`)
                  .setFields(display.map(ar => ({ name: `ID: ${ar._id}`, value: `- ${ar.tag}\n- ${ar.response}`, inline: true })))
              ]
            });
          }
        break;
      }
    }
  }
};
