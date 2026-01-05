const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('slap')
  .setDescription('Birine tokat at')
  .addUserOption(option => option.setName('target') 
    .setDescription('Tokat atmak istediğin üye') 
    .setRequired(true));

module.exports = {
  data: data,
  async execute(interaction) {

    const target = interaction.options.getUser('target');

    const embed = new EmbedBuilder()
      .setColor('Green')
    .setTitle(`Tokat atıldı!!`)
      .setDescription(`${interaction.user} ${target} üyesine tokat at!`)
      .setImage('https://media.giphy.com/media/uqSU9IEYEKAbS/giphy.gif')

    await interaction.reply({ embeds: [embed] });
  }
};