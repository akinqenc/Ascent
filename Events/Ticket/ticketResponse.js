const {ChannelType, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle} = require('discord.js');
const ticketSchema = require('../../Models/Ticket');
const TicketSetup = require('../../Models/TicketSetup');

module.exports =
{
    name: "interactionCreate",
    async execute(interaction)
    {
        const {guild, member, customId, channel} = interaction;
        const {ViewChannel, SendMessages, ManageChannels, ReadMessageHistory} = PermissionFlagsBits;
        const ticketId = Math.floor(Math.random() * 9000) + 10000;

        const data = await TicketSetup.findOne({GuildID: guild.id});

        const modalsToOpen = data.Buttons;

        if (interaction.isButton() && modalsToOpen.includes(customId)) {
            // Modal formu oluştur
            const modal = new ModalBuilder()
                .setCustomId(`${customId}`)
                .setTitle(`${customId} Ticket Oluştur`);

            const input1 = new TextInputBuilder()
                .setCustomId('subjectInput')
                .setLabel("Konu")
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            const input2 = new TextInputBuilder()
                .setCustomId('descriptionInput')
                .setLabel("Ticket Açmanızın Nedeni")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const input3 = new TextInputBuilder()
                .setCustomId('uyarı')
                .setLabel("Israrlı Ticketleriniz kapatılacaktır")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Okudum ve Anladım")
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(input1);
            const secondActionRow = new ActionRowBuilder().addComponents(input2);
            const thirdActionRow = new ActionRowBuilder().addComponents(input3);

            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

            try {
                await interaction.showModal(modal);
            } catch (error) {
                console.error('Modal gösterilemiyor:', error);
                await interaction.reply({ content: 'Modal gösterilemiyor, lütfen tekrar deneyin.', ephemeral: true });
            }
        }

        if(interaction.isModalSubmit() && !customId.startsWith('bulkAddChannelsModal') && !customId.startsWith('suggest-modal-') && !customId.startsWith('submit-review'))
        {

            const subject = interaction.fields.getTextInputValue('subjectInput');
            const description = interaction.fields.getTextInputValue('descriptionInput');
            const rules = interaction.fields.getTextInputValue('uyarı');

            let Role = data?.Handles;

            if(!data) return;
            if(!data.Buttons.includes(customId)) return;
            if(!guild.members.me.permissions.has(ManageChannels)) interaction.reply({content: 'Buna yetkin yok', ephemeral: true});

            try
            {
                await guild.channels.create({
                    name: `${customId} - ${member.user.username}`,
                    type: ChannelType.GuildText,
                    parent: data.Category,
                    permissionOverwrites: [
                        {
                            id: data.Everyone,
                            deny: [ViewChannel, SendMessages, ReadMessageHistory],
                        },
                        {
                            id: member.id,
                            allow: [ViewChannel, SendMessages, ReadMessageHistory],
                        },
                        {
                            id: Role,
                            allow: [ViewChannel, SendMessages, ReadMessageHistory],
                        },
                        
                    ],
                }).then(async (channel) =>{
                    const newTicketSchema = await ticketSchema.create({
                        GuildID: guild.id,
                        MembersID: member.id,
                        ChannelID: channel.id,
                        TicketID: ticketId,
                        Closed: false,
                        Locked: false,
                        Type: customId,
                        Claimed: false,
                    });

                    const embed = new EmbedBuilder()
                .setTitle(`${customId} - Ticket ${member.user.username}`)
                .setDescription(`**Konu:** ${subject}\n**Ticket Açma Nedeni:** ${description}\n\n **Kuralları ${rules}**`)
                .setFooter({text: `${ticketId}`, iconURL: member.displayAvatarURL({dynamic: true})})
                .setTimestamp();

                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('kapat').setLabel("Ticket'ı kapat").setStyle(ButtonStyle.Primary).setEmoji('🔴'),
                    new ButtonBuilder().setCustomId('kilitle').setLabel("Ticket'ı kilitle").setStyle(ButtonStyle.Secondary).setEmoji('🔒'),
                    new ButtonBuilder().setCustomId('aç').setLabel("Ticket'ı aç").setStyle(ButtonStyle.Success).setEmoji('🔓'),
                    new ButtonBuilder().setCustomId('talep').setLabel("Talep et").setStyle(ButtonStyle.Secondary).setEmoji('🔓')
                );

                channel.send({
                    embeds: ([embed]),
                    components: [button]
                });

                interaction.reply({content: 'Ticket başarıyla oluşturuldu', ephemeral: true});
                })
            }

            catch(err)
            {
                return console.log(err);
            }
        }
    }
}