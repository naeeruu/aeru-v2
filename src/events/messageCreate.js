export default {
  async execute(message) {
    if (message.author.bot) return;

    const { timestamp } = await message.client.mongo.db("client").collection("conn").findOne({ _id: message.client.id });
    if (timestamp !== message.client.readyTimestamp) return await process.exit(0);

    try {
    const autores = await message.client.mongo.db("autoresponse").collection(message.guildId).find().toArray().find(data => data.tag.toLowerCase() === message.content.toLowerCase());
      if (autores) await message.reply({
        content: autores.response,
        allowedMentions: { parse: [] }
      });
    } catch(error) {
      console.error(error);
    }
  }
};
