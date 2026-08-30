import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { pcrCommand } from './commands/pcr.js';
import { warrantCommand } from './commands/warrant.js';
dotenv.config();

async function main() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
    body: [pcrCommand.toJSON(), warrantCommand.toJSON()],
  });
  console.log('✅ Slash commands registered globally.');
}
main();