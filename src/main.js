import { MongoClient } from "mongodb";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

import * as config from "./config.js";
client.config = config;

client.mongo = new MongoClient(config.mongo.uri);
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

client.login(config.discord.token);
