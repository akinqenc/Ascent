const {Message, Client, SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const leaveSchema = require("../../Models/Leave");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Ayrılık Mesajı Sistemi")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(command =>
        command.setName('setup')
        .setDescription('Ayrılık Mesajı Sistemi kurar')
        .addChannelOption(option =>
            option.setName("channel")
            .setDescription("Ayrılık mesajı için kanal seç")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("leave-message")
            .setDescription("Ayrılık mesajını gir")
            .setRequired(true)
        )
    )
    .addSubcommand(command =>
        command.setName('remove')
        .setDescription('Ayrılık Mesajı Sistemini kaldırır')
    ),

    async execute(interaction)
    {
        const {channel, options} = interaction;

        const leaveChannel = options.getChannel("channel");
        const leaveMessage = options.getString("leave-message");

        if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages))
        {
            interaction.reply({content: "Buna yetkim yok.", ephemeral: true});
        }

        const sub = options.getSubcommand();

        switch (sub)
        {
            case 'setup':
                leaveSchema.findOne({Guild: interaction.guild.id}, async (err, data) => {
                    if(!data)
                    {
                        const newLeave = await leaveSchema.create({
                            Guild: interaction.guild.id,
                            Channel: leaveChannel.id,
                            Msg: leaveMessage,
                        });
                    }
                    interaction.reply({content: "Başarılı bir şekilde ayrılık mesajı oluşturuldu", ephemeral: true});
                });

                break;

            case 'remove':
                const removedata = await leaveSchema.findOne({Guild: interaction.guild.id});
                    if(!removedata)
                    {
                        return await interaction.reply({content: `Görünen o ki henüz bu sunucuya herhangi bir ayrılık mesaj sistemi kurulmamış.`, ephemeral: true});
                    }
                    else
                    {
                        await leaveSchema.deleteMany({Guild: interaction.guild.id});

                        await interaction.reply({content: "Ayrılık mesaj sistemi başarıyla silindi", ephemeral: true});
                    }
        }

        
    }
}