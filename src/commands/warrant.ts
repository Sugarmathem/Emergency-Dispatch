import {
  ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, Interaction,
  ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction,
  PermissionFlagsBits, SlashCommandBuilder, TextInputBuilder, TextInputStyle,
} from 'discord.js';
import { prisma } from '../lib/db.js';

export const warrantCommand = new SlashCommandBuilder()
  .setName('warrant')
  .setDescription('Warrant management system')
  .addSubcommand((s) => s.setName('create').setDescription('File a warrant'))
  .addSubcommand((s) => s.setName('list').setDescription('List all active warrants'))
  .addSubcommand((s) =>
    s.setName('clear')
      .setDescription('Clear a warrant (command team only)')
      .addIntegerOption((o) => o.setName('warrant-number').setDescription('Warrant number to clear').setRequired(true))
  );

export async function handleInteraction(interaction: Interaction) {
  if (interaction.isChatInputCommand() && interaction.commandName === 'warrant') {
    const sub = interaction.options.getSubcommand();
    if (sub === 'create') return openModal(interaction);
    if (sub === 'list') return listWarrants(interaction);
    if (sub === 'clear') return clearWarrant(interaction);
  }
  if (interaction.isModalSubmit() && interaction.customId === 'warrant-modal') return saveWarrant(interaction);
}

async function ensureServer(interaction: ChatInputCommandInteraction | ModalSubmitInteraction) {
  await prisma.server.upsert({
    where: { id: interaction.guildId! },
    update: {},
    create: { id: interaction.guildId!, name: interaction.guild?.name ?? 'Unknown' },
  });
}

function row(id: string, label: string, style: TextInputStyle, placeholder: string) {
  return new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
    new TextInputBuilder()
      .setCustomId(id)
      .setLabel(label)
      .setStyle(style)
      .setPlaceholder(placeholder)
      .setRequired(true)
  );
}

async function openModal(interaction: ChatInputCommandInteraction) {
  const modal = new ModalBuilder().setCustomId('warrant-modal').setTitle('⚖️ File a Warrant');
  modal.addComponents(
    row('targetName', 'Target Name', TextInputStyle.Short, 'John Doe'),
    row('targetRobloxId', 'Target Roblox ID', TextInputStyle.Short, '123456789'),
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId('type')
        .setLabel('Warrant Type')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('ARREST / SEARCH / BOLO')
        .setRequired(true)
    ),
    row('reason', 'Reason', TextInputStyle.Paragraph, 'What is this warrant for?')
  );
  await interaction.showModal(modal);
}

async function saveWarrant(interaction: ModalSubmitInteraction) {
  await interaction.reply({ content: '⏳ Filing warrant...', ephemeral: true });
  try {
    await ensureServer(interaction);
    const serverId = interaction.guildId!;

    const member = await prisma.member.upsert({
      where: { discordId_serverId: { discordId: interaction.user.id, serverId } },
      update: {},
      create: { discordId: interaction.user.id, serverId },
    });

    const last = await prisma.warrant.findFirst({ where: { serverId }, orderBy: { warrantNumber: 'desc' } });

    const warrant = await prisma.warrant.create({
      data: {
        warrantNumber: (last?.warrantNumber ?? 0) + 1,
        serverId,
        filedById: member.id,
        targetName: interaction.fields.getTextInputValue('targetName'),
        targetRobloxId: interaction.fields.getTextInputValue('targetRobloxId'),
        type: interaction.fields.getTextInputValue('type'),
        reason: interaction.fields.getTextInputValue('reason'),
      },
    });

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle(`⚖️ Warrant #${warrant.warrantNumber}`)
      .setDescription('Status: `ACTIVE`')
      .addFields(
        { name: 'Target', value: warrant.targetName, inline: true },
        { name: 'Roblox ID', value: warrant.targetRobloxId, inline: true },
        { name: 'Type', value: warrant.type, inline: true },
        { name: 'Filed By', value: interaction.user.username, inline: true },
        { name: 'Reason', value: warrant.reason }
      )
      .setTimestamp();

    await interaction.editReply({ content: '', embeds: [embed] });
  } catch (err) {
    console.error(err);
    await interaction.editReply({ content: '❌ Failed to file warrant. Check bot logs.' });
  }
}

async function listWarrants(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  try {
    await ensureServer(interaction);
    const serverId = interaction.guildId!;

    const warrants = await prisma.warrant.findMany({
      where: { serverId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });

    if (!warrants.length) {
      return interaction.editReply({ content: '📭 No active warrants.' });
    }

    const lines: string[] = warrants.map(
      (w) => `**#${w.warrantNumber}** — ${w.targetName} (${w.type}) — ${w.reason}`
    );

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('⚖️ Active Warrants')
      .setDescription(lines.join('\n'))
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    console.error(err);
    await interaction.editReply({ content: '❌ Failed to load warrants. Check bot logs.' });
  }
}

async function clearWarrant(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  try {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild))
      return interaction.editReply({ content: '🚫 Command team only.' });

    const serverId = interaction.guildId!;
    const warrantNumber = interaction.options.getInteger('warrant-number', true);

    const warrant = await prisma.warrant.findFirst({
      where: { serverId, warrantNumber },
    });

    if (!warrant) {
      return interaction.editReply({ content: `❌ Warrant #${warrantNumber} not found.` });
    }

    await prisma.warrant.update({
      where: { id: warrant.id },
      data: { status: 'CLEARED' },
    });

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle(`⚖️ Warrant #${warrantNumber} Cleared`)
      .setDescription(`Cleared by ${interaction.user.username}`)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    console.error(err);
    await interaction.editReply({ content: '❌ Failed to clear warrant. Check bot logs.' });
  }
}
