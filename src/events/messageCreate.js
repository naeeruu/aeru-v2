export default {
  class: "DiscordClient",
  async execute(message) {
    if (message.author.bot) return;

    const { timestamp } = await message.client.mongo.db("client").collection("conn").findOne({ _id: message.client.id });
    if (timestamp !== message.client.readyTimestamp) return await process.exit(0);

    try {
    const autores = (await message.client.mongo.db("autoresponse").collection(message.guildId).find().toArray()).find(data => data.tag.toLowerCase() === message.content.toLowerCase());
      if (autores) await message.reply({
        content: autores.response,
        allowedMentions: { parse: [] }
      });
    } catch(error) {
      console.error(error);
    }

    message.isFiltered = false;
    for (const filteredWords of message.client.config.discord.filteredWords) {
      if (message.content.toLowerCase().split(/ +/g).includes(filteredWords)) message.isFiltered = true;
    };
    if (message.isFiltered) {
      try {
        await message.delete();
        await message.channel.send({ content: `lain kali jangan gitu ya ${message.author.toString()} <:_:985941800273469480>` });
      } catch(error) {
        console.error(error);
      }
    }

    if (message.channelId === "965760731133919232") {
      try {
        if (message.attachments.find(data => data.contentType.startsWith("image"))) return await message.startThread({
          name: `rate ${message.author.username}'s art(*´ω｀*)`
        });
      } catch(error) {
        console.error(error);
      }
    }
  }
};
