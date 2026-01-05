const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');
const ticketSchema = require('../../Models/Ticket');

module.exports =
{
    data: new SlashCommandBuilder()
   .setName('ticket')
   .setDescription('Ticket İşlemleri')
   .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
   .addStringOption(option =>
    option.setName('işlem')
    .setDescription("Ticket'a üye ekle veya Ticket'tan üye çıkar")
    .setRequired(true)
    .addChoices(
        {name: "Ekle", value: "ekle"},
        {name: "Çıkar", value: "çıkar"}
        )
    )
    .addUserOption(option =>
    option.setName('üye')
    .setDescription('Bir üye seç')
    .setRequired(true)
    ),

    async execute(interaction)
    {
        const {options, guildId, channel} = interaction;
        const member = options.getUser("üye");
        const action = options.getString("işlem");

        const embed = new EmbedBuilder();

        switch (action)
        {
            case "ekle":
                ticketSchema.findOne({GuildID: guildId, ChannelID: channel.id}, async (err, data) => {
                    if(err) throw err;
                    if(!data) return interaction.reply({embeds: [embed.setColor('Red').setDescription("Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.")], ephemeral: true});
                    if(data.MembersID.includes(member.id)) return interaction.reply({embeds: [embed.setColor('Red').setDescription("Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.")], ephemeral: true});

                    data.MembersID.push(member.id);

                    channel.permissionOverwrites.edit(member.id, {
                        SendMessages: true,
                        ViewChannel: true,
                        ReadMessageHistory: true,
                    });

                    interaction.reply({embeds: [embed.setColor('Green').setDescription(`${member}, Ticket'a eklendi`)], ephemeral: true});
                });
                break;

                case "çıkar":
                ticketSchema.findOne({GuildID: guildId, ChannelID: channel.id}, async (err, data) => {
                    if(err) throw err;
                    if(!data) return interaction.reply({embeds: [embed.setColor('Red').setDescription("Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.")], ephemeral: true});
                    if(data.MembersID.includes(member.id)) return interaction.reply({embeds: [embed.setColor('Red').setDescription("Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.")], ephemeral: true});

                    data.MembersID.remove(member.id);

                    channel.permissionOverwrites.edit(member.id, {
                        SendMessages: false,
                        ViewChannel: false,
                        ReadMessageHistory: false
                    });

                    interaction.reply({embeds: [embed.setColor('Green').setDescription(`${member}, Ticket'tan çıkarıldı`)], ephemeral: true});
                });
                break;
        }
    }
}