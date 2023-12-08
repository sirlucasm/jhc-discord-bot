import { Client, Events, GatewayIntentBits } from "discord.js";
import { botEnvs } from "./configs/environment";
import { commands } from "./commands";
import { deployCommands } from "./bot/deploy-commands";

console.log("Bot is starting...");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once(Events.ClientReady, () => {
  console.log("\nDiscord bot is ready! 🤖\n");
});

client.login(botEnvs.DISCORD_TOKEN);

client.on(Events.GuildCreate, async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});
