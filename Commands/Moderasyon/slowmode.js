const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType} = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Üyenin kaç saniyede bir mesaj gönderebileceğini girin')
    .addIntegerOption(option =>
        option.setName('duration')
        .setDescription('Yavaş modun süresi(saniye)')
        .setRequired(true)
    )
    .addChannelOption(option =>
        option.setName('channel')
        .setDescription('Yavaş modu hangi kanala uygulamak istersin?')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

    async execute(interaction)
    {
        const{options} = interaction;
        const duration = options.getInteger('duration');
        const channel = options.getChannel('channel') || interaction.channel;

        const embed = new EmbedBuilder()
        .setColor("DarkBlue")
        .setDescription(`✅ ${channel} kanalına ${duration} saniyelik **Yavaş Mod** uygulanmıştır`)

        channel.setRateLimitPerUser(duration).catch(err =>{
            return;
        });

        await interaction.reply({embeds: [embed]});
    }
}