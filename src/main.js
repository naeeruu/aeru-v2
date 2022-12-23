import { MongoClient } from "mongodb";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.mongo = new MongoClient(process.env.MONGO_URI);
client.commands = new Collection();

import * as commands from "./commands/commands.js";
for (const command of Object.values(commands)) {
  client.commands.set(client.commands.size, command);
};

import * as events from "./events/events.js";
for (const eventName of Object.keys(events)) {
  const event = events[eventName];
  if (event.once) {
    client.once(Events[eventName], (...args) => event.execute(...args));
  } else {
    client.on(Events[eventName], (...args) => event.execute(...args));
  }
};

client.login(process.env.DISCORD_TOKEN);
