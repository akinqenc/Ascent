const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const gay = require('../../Functions/gay')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nigga-meter')
    .setDescription('Zenci Ölçer')
    .addUserOption(option => option.setName('user').setDescription('Bakmak istediğin üye').setRequired(true)),
    async execute (interaction) {
        const gays = gay[Math.floor(Math.random() * gay.length)];
        const user = interaction.options.getUser('user');
        const embed = new EmbedBuilder()
        .setColor('NotQuiteBlack')
        .setTitle('🐒 Ne Kadar Kömürsün?')
        .setDescription(`**${user}** **${gays}** Zenci yani kömürsün`)
        .setFooter({text: 'Kömür Ölçer'})
        .setTimestamp()

        await interaction.reply({ embeds: [embed] })
    }
}