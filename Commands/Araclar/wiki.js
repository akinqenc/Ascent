const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

async function getTurkishWikipediaPage(query) {
  try {
    const response = await axios.get('https://tr.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        format: 'json',
        titles: query,
        prop: 'extracts',
        exintro: true,
        explaintext: true,
        uselang: 'tr',
      },
    });

    const page = Object.values(response.data.query.pages)[0];
    if (page.missing !== undefined || page.invalid !== undefined) {
      throw new Error('Sayfa bulunamadı');
    }

    return page.extract;
  } catch (error) {
    console.error('Wikipedia API hatası:', error);
    throw error;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wiki')
    .setDescription('Vikipedi')
    .addStringOption((option) =>
      option.setName('query').setDescription('Vikide ara')
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');

    await interaction.deferReply();

    try {
      const turkishSummary = await getTurkishWikipediaPage(query);

      const embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle(`Viki Araması: ${query}`)
        .setDescription(`\`\`\`${turkishSummary.slice(0, 5096)}\`\`\``);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: 'Vikipedi, aradığın şeyi bulamadı...',
        ephemeral: true,
      });
    }
  },
};