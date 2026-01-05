const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const Levels = require("discord.js-leveling");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("remain")
    .setDescription("Yeni seviyeye ulaşmak için gereken xp sayısına bak.")
    .addIntegerOption(option =>
        option.setName("seviye")
        .setDescription("İstenen seviyeye kalan xp")
        .setRequired(true)
    ),

    async execute(interaction)
    {
        const {options}= interaction;

        const level = options.getInteger("seviye");

        const xpAmount = Levels.xpFor(level);

        interaction.reply({content: `Seviye **${level}** düzeyine ulaşabilmek için **${xpAmount} xp** gerekiyor.`, ephemeral: true});
    }
}