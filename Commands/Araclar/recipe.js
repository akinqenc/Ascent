const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const translate = require('@iamtraction/google-translate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("recipe")
        .setDescription("Yemek Tarifi")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("Yemek tarifi için bir yemek adı gir")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('language')
                .setDescription('Hangi dile çevrilsin?')
                .addChoices(
                    { name: 'Turkish', value: 'tr' },
                    { name: 'French', value: 'fr' },
                    { name: 'German', value: 'de' },
                    { name: 'Italian', value: 'it' },
                    { name: 'Portugese', value: 'pt' },
                    { name: 'Spanish', value: 'es' },
                    { name: 'Greek', value: 'gl' },
                    { name: 'Russian', value: 'ru' },
                    { name: 'Japanese', value: 'ja' },
                    { name: 'Arabic', value: 'ar' }
                )
                .setRequired(false)
        ),

    async execute(interaction) {
        const { options } = interaction;

        const mealName = options.getString('query');
        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
            const meals = response.data.meals;

            if (!meals) {
                return interaction.reply('Belirtilen yemek bulunamadı.');
            }

            const meal = meals[0];
            const instructions = meal.strInstructions;
            
            const lang = options.getString('language');

            if(!lang)
            {

            const embed = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle(`**${meal.strMeal}**`)
                .setDescription(`\`\`\`${instructions}\`\`\``);

            await interaction.reply({ embeds: [embed] });

            }

            else if (lang) {
                const applied = await translate(instructions, { to: lang });

                const embed2 = new EmbedBuilder()
                    .setColor("Yellow")
                    .setTitle(`**${meal.strMeal}**`)
                    .setDescription(`\`\`\`${applied.text}\`\`\``);

                await interaction.reply({ embeds: [embed2] });
            }
        }
        catch (error) {
            console.error('API hatası:', error);
            interaction.reply('Yemek tarifi alırken bir hata oluştu.');
        }
    }
};
