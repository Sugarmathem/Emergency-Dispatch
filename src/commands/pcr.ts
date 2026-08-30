import {
  ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle,
  ChatInputCommandInteraction, EmbedBuilder, Interaction,
  ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction,
  PermissionFlagsBits, SlashCommandBuilder, TextInputBuilder, TextInputStyle,
} from 'discord.js';
import { prisma } from '../lib/db.js';

export const pcrCommand = new SlashCommandBuilder()
  .setName('pcr')
  .setDescription('Patient Care Report system')
  .addSubcommand((s) => s.setName('submit').setDescription('Submit a PCR'))
  .addSubcommand((s) => s.setName('stats').setDescription('Your personal PCR stats'))
  .addSubcommand((s) => s.setName('leaderboard').setDescription('Department leaderboard'))
  .addSubcommand((s) => s.setName('setup').setDescription('Set this channel as the PCR review channel'));

export async function handleInteraction(interaction: Interaction) {
  if (interaction.isChatInputCommand() && interaction.commandName === 'pcr') {
    const sub = interaction.options.getSubcommand();
    if (sub === 'submit') return openModal(interaction);
    if (sub === 'stats') return stats(interaction);
    if (sub === 'leaderboard') return leaderboard(interaction);
    if (sub === 'setup') return setup(interaction);
  }
  if (interaction.isModalSubmit() && interaction.customId === 'pcr-modal') return savePcr(interaction);
  if (interaction.isButton() && (interaction.customId.startsWith('approve:') || interaction.customId.startsWith('deny:')))
    return reviewPcr(interaction);
}

async function ensureServer(interaction: ChatInputCommandInteraction | ModalSubmitInteraction) {
  await prisma.server.upsert({
    where: { id: interaction.guildId! },
    update: {},
    create: { id: interaction.guildId!, name: interaction.guild?.name ?? 'Unknown' },
  });
}

async function setup(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });
  try {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild))
      return interaction.editReply({ content: '🚫 Command team only.' });

    await prisma.server.upsert({
      where: { id: interaction.guildId! },
      update: { pcrChannelId: interaction.channelId },
      create: { id: interaction.guildId!, name: interaction.guild?.name ?? 'Unknown', pcrChannelId: interaction.channelId },
    });
    await interaction.editReply({ content: '✅ This channel is now the PCR review channel.' });
  } catch (err) {
    console.error(err);
    await interaction.editReply({ content: '❌ Setup failed. Check bot logs.' });
  }
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
  const modal = new ModalBuilder().setCustomId('pcr-modal').setTitle('🚑 Patient Care Report');
  modal.addComponents(
    row('unit', 'Unit Number', TextInputStyle.Short, 'Medic 3'),
    row('callType', 'Call Type', TextInputStyle.Short, 'MVA / Cardiac Arrest / Trauma'),
    row('disposition', 'Disposition', TextInputStyle.Short, 'Transported / Treated on Scene'),
    row('commandTeam', 'Command Team on Duty', TextInputStyle.Short, 'Team A'),
    row('narrative', 'Narrative', TextInputStyle.Paragraph, 'What happened? Treatments given?')
  );
  await interaction.showModal(modal);
}

async function savePcr(interaction: ModalSubmitInteraction) {
  await interaction.reply({ content: '⏳ Saving your PCR...', ephemeral: true });
  try {
    await ensureServer(interaction);
    const serverId = interaction.guildId!;

    const member = await prisma.member.upsert({
      where: { discordId_serverId: { discordId: interaction.user.id, serverId } },
      update: {},
      create: { discordId: interaction.user.id, serverId },
    });

    const last = await prisma.pcr.findFirst({ where: { serverId }, orderBy: { pcrNumber: 'desc' } });

    const pcr = await prisma.pcr.create({
      data: {
        pcrNumber: (last?.pcrNumber ?? 0) + 1,
        serverId,
        memberId: member.id,
        unitNumber: interaction.fields.getTextInputValue('unit'),
        callType: interaction.fields.getTextInputValue('callType'),
        disposition: interaction.fields.getTextInputValue('disposition'),
        commandTeam: interaction.fields.getTextInputValue('commandTeam'),
        narrative: interaction.fields.getTextInputValue('narrative'),
      },
    });

    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle(`🚑 PCR #${pcr.pcrNumber} — ${interaction.user.username}`)
      .setDescription('Status: `PENDING REVIEW`')
      .addFields(
        { name: 'Unit', value: pcr.unitNumber, inline: true },
        { name: 'Call Type', value: pcr.callType, inline: true },
        { name: 'Disposition', value: pcr.disposition, inline: true },
        { name: 'Command Team', value: pcr.commandTeam ?? '—', inline: true },
        { name: 'Narrative', value: pcr.narrative }
      )
      .setTimestamp();

    const server = await prisma.server.findUnique({ where: { id: serverId } });
    if (server?.pcrChannelId) {
      const channel = await interaction.client.channels.fetch(server.pcrChannelId).catch(() => null);
      if (channel && 'send' in channel) {
        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId(`approve:${pcr.id}`).setLabel('Approve').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId(`deny:${pcr.id}`).setLabel('Deny').setStyle(ButtonStyle.Danger)
        );
        await channel.send({ embeds: [embed], components: [buttons] });
      }
    }

    await interaction.editReply({ content: '', embeds: [embed.setColor(0x2ecc71)] });
  } catch (err) {
    console.error(err);
    await interaction.editReply({ content: '❌ Failed to save PCR. Check bot logs.' });
  }
}

async function reviewPcr(interaction: ButtonInteraction) {
  await interaction.deferUpdate();
  try {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild))
      return interaction.followUp({ content: '🚫 Command team only.', ephemeral: true });

    const [action, pcrId] = interaction.customId.split(':');
    const status = action === 'approve' ? 'APPROVED' : 'DENIED';

    await prisma.pcr.update({
      where: { id: pcrId },
      data: { status, reviewedAt: new Date() },
    });

    const embed = EmbedBuilder.from(interaction.message.embeds[0])
      .setColor(status === 'APPROVED' ? 0x2ecc71 : 0xe74c3c)
      .setDescription(`Status: \`${status}\` by ${interaction.user.username}`);

    const result = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('reviewed')
        .setLabel(status === 'APPROVED' ? `✅ Approved by ${interaction.user.username}` : `❌ Denied by ${interaction.user.username}`)
        .setStyle(status === 'APPROVED' ? ButtonStyle.Success : ButtonStyle.Danger)
        .setDisabled(true)
    );

    await interaction.editReply({ embeds: [embed], components: [result] });
  } catch (err) {
    console.error(err);
    await interaction.followUp({ content: '❌ Review failed. Check bot logs.', ephemeral: true });
  }
}

async function stats(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });
  try {
    await ensureServer(interaction);
    const serverId = interaction.guildId!;
    const member = await prisma.member.findUnique({
      where: { discordId_serverId: { discordId: interaction.user.id, serverId } },
    });
    if (!member)
      return interaction.editReply({ content: '📭 No PCRs on file yet. Use `/pcr submit`.' });

    const [total, approved, pending] = await Promise.all([
      prisma.pcr.count({ where: { memberId: member.id } }),
      prisma.pcr.count({ where: { memberId: member.id, status: 'APPROVED' } }),
      prisma.pcr.count({ where: { memberId: member.id, status: 'PENDING' } }),
    ]);

    const groups = await prisma.pcr.groupBy({
      by: ['memberId'],
      where: { serverId, status: 'APPROVED' },
      _count: { _all: true },
    });
    const idx = groups
      .sort((a, b) => b._count._all - a._count._all)
      .findIndex((g) => g.memberId === member.id);

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle(`📊 ${interaction.user.username}'s PCR Record`)
      .addFields(
        { name: '✅ Approved', value: String(approved), inline: true },
        { name: '⏳ Pending', value: String(pending), inline: true },
        { name: '📁 Total', value: String(total), inline: true },
        { name: '🏅 Department Rank', value: idx === -1 ? 'Unranked' : `#${idx + 1}` }
      )
      .setTimestamp();
    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    console.error(err);
    await interaction.editReply({ content: '❌ Failed to load stats. Check bot logs.' });
  }
}

async function leaderboard(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  try {
    await ensureServer(interaction);
    const serverId = interaction.guildId!;
    const top = (
      await prisma.pcr.groupBy({
        by: ['memberId'],
        where: { serverId, status: 'APPROVED' },
        _count: { _all: true },
      })
    )
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 5);

    if (!top.length) return interaction.editReply({ content: '📭 No approved PCRs yet.' });

    const medals = ['🥇', '🥈', '', '4️', '5️⃣'];
    const lines: string[] = [];
    for (let i = 0; i < top.length; i++) {
      const m = await prisma.member.findUnique({ where: { id: top[i].memberId } });
      const user = await interaction.client.users.fetch(m!.discordId).catch(() => null);
      lines.push(`${medals[i]} **${user?.username ?? 'Unknown'}** — ${top[i]._count._all} PCRs`);
    }

    const teams = (
      await prisma.pcr.groupBy({
        by: ['commandTeam'],
        where: { serverId, status: 'APPROVED' },
        _count: { _all: true },
      })
    ).sort((a, b) => b._count._all - a._count._all);

    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle('🏆 Department Leaderboard')
      .setDescription(lines.join('\n'))
      .addFields({
        name: '📡 Command Team Totals',
        value: teams.map((t) => `**${t.commandTeam ?? 'Unknown'}**: ${t._count._all}`).join(' | ') || '—',
      })
      .setTimestamp();
    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    console.error(err);
    await interaction.editReply({ content: '❌ Failed to load leaderboard. Check bot logs.' });
  }
}