const { ButtonInteraction, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const ticketSetup = require('../../Models/TicketSetup');
const ticketSchema = require('../../Models/Ticket');

module.exports =
{
  name: "interactionCreate",

  async execute(interaction) {
    const { guild, member, customId, channel, message } = interaction;
    const { SendMessages, ManageChannels } = PermissionFlagsBits;

    if (!interaction.isButton) return;

    if (!["kapat", "kilitle", "aç", "talep"].includes(customId)) return;

    const docs = await ticketSetup.findOne({ GuildID: guild.id });

    if (!docs) return;
    if (!guild.members.me.permissions.has((r) => r.id === docs.Handlers)) return interaction.reply({ content: 'Buna yetkin yok', ephemeral: true });

    const embed = new EmbedBuilder().setColor('Aqua');

    ticketSchema.findOne({ ChannelID: channel.id }, async (err, data) => {
      if (err) throw err;
      if (!data) return;

      const fetchedMember = await guild.members.cache.get(data.MembersID);

      switch (customId) {
        case 'kapat':
          if (data.Closed == true) return interaction.reply({ content: "Ticket silindi...", ephemeral: true });

          // Etkileşime hemen yanıt ver (3 saniye kuralı için)
          await interaction.deferReply();

          // Butonları devre dışı bırak
          const disabledButtons = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId('kapat').setLabel("Ticket'ı kapat").setStyle(ButtonStyle.Primary).setEmoji('🔴').setDisabled(true),
            new ButtonBuilder().setCustomId('kilitle').setLabel("Ticket'ı kilitle").setStyle(ButtonStyle.Secondary).setEmoji('🔒').setDisabled(true),
            new ButtonBuilder().setCustomId('aç').setLabel("Ticket'ı aç").setStyle(ButtonStyle.Success).setEmoji('🔓').setDisabled(true),
            new ButtonBuilder().setCustomId('talep').setLabel("Talep et").setStyle(ButtonStyle.Secondary).setEmoji('♻️').setDisabled(true)
          );

          // Orijinal mesajı güncelle ve butonları devre dışı bırak
          await message.edit({ components: [disabledButtons] });

          const transcript = await createTranscript(channel, {
            limit: -1,
            returnBuffer: false,
            filename: `${member.user.username} - ticket${data.Type}-${data.TicketID}.html`,
          });

          await ticketSchema.updateOne({ ChannelID: channel.id }, { Closed: true });

          const transcriptEmbed = new EmbedBuilder()
            .setTitle(`Transcript Type: ${data.Type}\nID: ${data.TicketID}`)
            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

          const transcriptProcess = new EmbedBuilder()
            .setTitle('Transcript kaydediliyor...')
            .setDescription('Ticket, 10 saniye içinde kapatılacak, ticket transkriptini almak için DMlerinizi aktif ediniz.')
            .setColor('Red')
            .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

          const res = await guild.channels.cache.get(docs.Transcripts).send({
            embeds: [transcriptEmbed],
            files: [transcript],
          });

          // interaction.reply yerine editReply kullan (deferReply yaptığımız için)
          await interaction.editReply({ embeds: [transcriptProcess] });

          setTimeout(function () {
            member.send({
              embeds: [transcriptEmbed.setDescription(`Ticket transkriptin: ${res.url}`)]
            }).catch(() => channel.send('Maalesef DM yoluyla ticket transkriptinizi gönderemiyorum'));
            channel.delete();
          }, 10000);

          break;

        case 'kilitle':
          if (!member.permissions.has(ManageChannels)) return interaction.reply({ content: 'Buna yetkin yok', ephemeral: true });

          if (data.Locked == true) return interaction.reply({ content: 'Ticket kilit moduna alındı', ephemeral: true });

          await ticketSchema.updateOne({ ChannelID: channel.id }, { Locked: true });
          embed.setDescription('Ticket başarıyla kilitlendi 🔐');

          data.MembersID.forEach((m) => {
            channel.permissionOverwrites.edit(m, { SendMessages: false });
          });

          return interaction.reply({ embeds: [embed] });

        case 'aç':
          if (!member.permissions.has(ManageChannels)) return interaction.reply({ content: 'Buna yetkin yok', ephemeral: true });

          if (data.Locked == false) return interaction.reply({ content: 'Ticket zaten kilitli değil', ephemeral: true });

          await ticketSchema.updateOne({ ChannelID: channel.id }, { Locked: false });
          embed.setDescription('Ticket kilidi başarıyla kaldırıldı 🔓');

          data.MembersID.forEach((m) => {
            channel.permissionOverwrites.edit(m, { SendMessages: true });
          });

          return interaction.reply({ embeds: [embed] });

        case 'talep':
          if (!member.permissions.has(ManageChannels)) return interaction.reply({ content: 'Buna yetkin yok', ephemeral: true });

          if (data.Claimed == true) return interaction.reply({ content: `Ticket <@${data.ClaimedBy}> tarafından talep edildi.`, ephemeral: true });

          await ticketSchema.updateOne({ ChannelID: channel.id }, { Claimed: true, ClaimedBy: member.id });
          embed.setDescription(`Ticket başarıyla ${member} tarafından talep edildi`);

          interaction.reply({ embeds: [embed] });
          break;
      }
    })
  }
}