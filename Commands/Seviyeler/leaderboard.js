const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const Levels = require("discord.js-leveling");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Liderlik tablosunu incele."),

    async execute(interaction)
    {
        const {guildId, client, options} = interaction;

        const rawLeaderboard = await Levels.fetchLeaderboard(guildId, 10);

        try
        {
            if(rawLeaderboard.length < 1) return interaction.reply("Liderlik tablosunda henüz kimse yok.");

        
            const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);
            const lb = leaderboard.map(e => `**${e.position}.** ${e.username}\n**Seviye:** ${e.level}\n**XP:** ${e.xp.toLocaleString()}`);
    
            const embed = new EmbedBuilder()
            .setTitle("Liderlik Tablosu")
            .setDescription(lb.join("\n\n"))
            .setTimestamp();
            return interaction.reply({embeds: [embed]});
        }
        catch(e)
        {
            return interaction.reply({content: "Bu işlemi şimdilik gerçekleştiremiyorum. Lütfen daha sonra tekrar dene"});
        }
        
    }
};