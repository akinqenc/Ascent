const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require('discord.js')
const reactor = require('../../Models/reactorSchema');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('reactor')
    .setDescription('Emojilerle otomatik tepki verme sistemini ayarla')
    .addSubcommand(command =>
        command.setName('setup')
        .setDescription('Otomatik tepki sistemini ayarla')
        .addStringOption(option=>
            option.setName('emoji')
            .setDescription('Hangi emojiyle tepki vermemi istersin?')
            .setRequired(true)
        )
        .addChannelOption(option=>
            option.setName('channel')
            .setDescription('Sistemi hangi kanala kurmak istersin?')
            .setRequired(false)
        )
    )
    .addSubcommand(command =>
        command.setName('disable')
        .setDescription('Otomatik tepki sistemini **bir kanal için** kapat')
        .addChannelOption(option=>
            option.setName('channel')
            .setDescription('Sistemi kaldırmak istediğin kanal')
            .setRequired(true)
        )
    )
    .addSubcommand(command =>
        command.setName('remove-all')
        .setDescription('Otomatik tepki sistemini sunucuda kapat')
    ),

    async execute(interaction)
    {
        const {options, member, guild} = interaction;
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return await interaction.reply({content: `Bu komutu sadece yöneticiler kullanabilir.`, ephemeral: true});

            let channel = options.getChannel('channel');
            if(!channel)
            {
                channel = interaction.channel;
            }
            const sub = options.getSubcommand();
            const data = await reactor.findOne({Guild: guild.id, Channel: channel.id});

            switch(sub)
            {
                case 'setup':
                    if(data)
                    {
                        return await interaction.reply({content: `${channel} kanalına zaten bir tepki sistemi kurdun.`, ephemeral: true});
                    }
                    else
                    {
                        const emoji = options.getString('emoji');

                        await reactor.create({
                            Guild:interaction.guild.id,
                            Channel: channel.id,
                            Emoji: emoji
                        });

                        const embed = new EmbedBuilder()
                        .setColor('Blue')
                        .setDescription(`⚒️ Tepki sistemi ${channel} kanalı için kurulmuştur.`)

                        await interaction.reply({embeds: [embed], ephemeral: true});
                    }

                    break;
                
                case 'disable':
                    if(!data)
                        return await interaction.reply({content: `${channel} kanalına zaten bir tepki sistemi kurulmamış.`, ephemeral: true});
                    else
                    {
                        await reactor.deleteMany({Guild: interaction.guild.id, Channel: channel.id});

                        const embed = new EmbedBuilder()
                        .setColor('Blue')
                        .setDescription(`⚒️ ${channel} kanalından tepki sistemi kaldırılmıştır.`)

                        await interaction.reply({embeds: [embed], ephemeral: true});
                    }

                    break;

                case 'remove-all':
                    const removedata = await reactor.findOne({Guild: interaction.guild.id});
                    if(!removedata)
                    {
                        return await interaction.reply({content: `Görünen o ki henüz bu sunucuya herhangi bir tepki sistemi kurulmamış.`, ephemeral: true});
                    }
                    else
                    {
                        await reactor.deleteMany({Guild: interaction.guild.id});

                        const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`⚔️ Otomatik tepki sistemi, bütün sunucudan silinmiştir.`)

                        await interaction.reply({embeds: [embed], ephemeral: true});
                    }
            }
    }
}