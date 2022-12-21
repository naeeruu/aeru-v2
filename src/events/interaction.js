import { Events } from "discord.js";

export default {
  name: Events.InteractionCreate,
  async execute(interaction) {
    await console.log(`Interaction fired!`);
  }
};
