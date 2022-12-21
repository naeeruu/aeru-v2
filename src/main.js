import { MongoClient } from "mongodb";
import { Client, Collection, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.mongo = new MongoClient(process.env.MONGO_URI);
client.commands = new Collection();

import * as events from "./events/events.js";
for (const event of Object.values(events)) {
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
};

client.login(process.env.DISCORD_TOKEN);
