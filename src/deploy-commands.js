import { discord } from "./config.js";
import { Routes, REST } from "discord.js";
import * as commands from "./commands/commands.js";

const rest = new REST({ version: "10" })
  .setToken(discord.token);
const applicationCommands = Object.values(commands).map(command => command.data);

(async () => {
  try {
    const data = await rest.put(Routes.applicationCommands(discord.id), {
      body: applicationCommands
    });
    console.log(`${data.length} command(s) registered`)
  } catch(error) {
    console.error(error);
  };
})();
