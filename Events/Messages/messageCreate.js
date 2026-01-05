const {EmbedBuilder, RequestManager} = require("discord.js");
const Levels = require("discord.js-leveling");

module.exports = {
    name: "messageCreate",

    async execute(message)
    {
        if(!message.guild || message.author.bot) return;

        if(message.content.length < 3) return;

        const randomAmountOfXp = Math.floor(Math.random() * 24) + 1;
        const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);

        if(hasLeveledUp)
        {
            const user = await Levels.fetch(message.author.id, message.guild.id);

            const levelEmbed = new EmbedBuilder()
            .setTitle("Yeni Seviye!")
            .setDescription(`**GG** ${message.author}, **${user.level + 1}** seviyesine yükseldin! 🤓`)
            .setColor("Random")
            .setTimestamp();

            const sendEmbed = await message.channel.send({embeds: [levelEmbed]});
            sendEmbed.react('🍀');
        }
    }
}