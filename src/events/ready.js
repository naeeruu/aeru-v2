export default {
  class: "DiscordClient",
  once: true,
  async execute(client) {
    console.log(`Connected! ^^`);
    await client.application.fetch();

    await client.mongo.connect();
    await client.mongo.db("client").collection("conn").updateOne({ _id: client.id }, { $set: {timestamp: client.readyTimestamp } }, { upsert: true });
    setInterval(async () => {
      const { timestamp } = await client.mongo.db("client").collection("conn").findOne({ _id: client.id });
      if (timestamp !== client.readyTimestamp) return await process.exit(0);
    }, 1000);
  }
};
