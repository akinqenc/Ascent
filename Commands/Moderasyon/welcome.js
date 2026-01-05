const {Message, Client, SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const welcomeSchema = require("../../Models/Welcome");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Hoşgeldin mesajı sistemi")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(command =>
        command.setName("setup")
        .setDescription('Hoşgeldin mesajı sistemi kurar')
        .addChannelOption(option =>
            option.setName("channel")
            .setDescription("Hoşgeldin mesajı için kanal seç")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("welcome-message")
            .setDescription("Hoşgeldin mesajını gir")
            .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName("welcome-role")
            .setDescription("Sunucuya giriş rolünü ata")
            .setRequired(true)
        )
    )
    .addSubcommand(command =>
        command.setName('remove')
        .setDescription('Hoşgeldin mesaj sistemini kaldırır')
    ),

    async execute(interaction)
    {
        const {channel, options} = interaction;

        const welcomeChannel = options.getChannel("channel");
        const welcomeMessage = options.getString("welcome-message");
        const roleId = options.getRole("welcome-role");

        if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages))
        {
            interaction.reply({content: "Buna yetkim yok.", ephemeral: true});
        }

        const sub = options.getSubcommand();

        switch(sub)
        {
            case 'setup':
                welcomeSchema.findOne({Guild: interaction.guild.id}, async (err, data) => {
                    if(!data)
                    {
                        const newWelcome = await welcomeSchema.create({
                            Guild: interaction.guild.id,
                            Channel: welcomeChannel.id,
                            Msg: welcomeMessage,
                            Role: roleId.id
                        });
                    }
                    interaction.reply({content: "Başarılı bir şekilde hoşgeldin mesajı oluşturuldu", ephemeral: true});
                });

                break;
            
            case 'remove':
                const removedata = await welcomeSchema.findOne({Guild: interaction.guild.id});
                    if(!removedata)
                    {
                        return await interaction.reply({content: `Görünen o ki henüz bu sunucuya herhangi bir hoşgedlin mesaj sistemi kurulmamış.`, ephemeral: true});
                    }
                    else
                    {
                        await welcomeSchema.deleteMany({Guild: interaction.guild.id});

                        await interaction.reply({content: "Hoşgeldin mesaj sistemi başarıyla silindi", ephemeral: true});
                    }
        }

        
    }
}