import { Client, Events, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { handleInteraction } from './commands/pcr.js';
import { prisma } from './lib/db.js';

dotenv.config();

const client = new Client({
  // Least privilege. No privileged intents. Security selling point.
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (c) => console.log(`✅ ${c.user.username} online. Locked in.`));

// Auto-register server in DB when bot is added
client.on(Events.GuildCreate, async (guild) => {
  await prisma.server.upsert({
    where: { id: guild.id },
    update: { name: guild.name },
    create: { id: guild.id, name: guild.name },
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    await handleInteraction(interaction);
  } catch (err) {
    console.error(err);
    if (interaction.isRepliable() && !interaction.replied)
      await interaction.reply({ content: '❌ Internal error. Check logs.', ephemeral: true }).catch(() => {});
  }
});

client.login(process.env.DISCORD_TOKEN);