import { MongoClient } from "mongodb";
import { Octokit } from "@octokit/rest";
import { ActivityType, Client, Collection, Events, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  presence: {
    activities: [
      {
        name: "our memorable photos",
        type: ActivityType.Watching
      }
    ],
    status: "idle"
  }
});

import * as config from "./config.js";
client.config = config;

client.mongo = new MongoClient(config.mongo.uri);
client.commands = new Collection();
client.github = new Octokit({
  auth: config.github.token
});

import * as commands from "./commands/commands.js";
for (const command of Object.values(commands)) {
  client.commands.set(client.commands.size, command);
};

import * as events from "./events/events.js";
for (const eventName of Object.keys(events)) {
  const event = events[eventName];
  switch (event.class) {
    case "DiscordClient":
      if (event.once) {
        client.once(Events[eventName], (...args) => event.execute(...args));
      } else {
        client.on(Events[eventName], (...args) => event.execute(...args));
      }
    break;
  }
};

client.login(config.discord.token);
