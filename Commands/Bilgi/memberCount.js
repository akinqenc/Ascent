const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName("member-count")
    .setDescription('Sunucudaki üye sayısı'),

    async execute(interaction)
    {
        const {guild} = interaction;
        
        const members = await guild.members.fetch();
        const bots = members.filter(member => member.user.bot);

        const myBotId = '1068084479161290802';
        const otherBots = bots.filter(bot => bot.user.id !== myBotId);

        const botCount = otherBots.size + 1;

        const embed = new EmbedBuilder()
        .setColor('White')
        .setDescription(`👪 **Kullanıcılar** ${guild.memberCount - botCount}\n🤖 **Botlar** ${botCount}`)
        .setTimestamp()

        await interaction.reply({embeds: [embed]});
    }
}

