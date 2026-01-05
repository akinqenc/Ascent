const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const weather = require('weather-js');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName(`weather`)
    .setDescription(`Hava durumu`)
    .addStringOption(option =>
        option.setName('location')
        .setDescription("Nerenin hava durmuna bakmak istersin?")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('degree-type')
        .setDescription("Celcius mu Fahrenheit mı?")
        .addChoices
        (
            {name: `Fahrenheit` , value: 'F'},
            {name: `Celcius` , value: 'C'}
        )
        .setRequired(true)
    ),

    async execute(interaction)
    {
        const {options} = interaction;
        const location = options.getString('location');
        const degree = options.getString('degree-type');

        await interaction.reply({content: `☁️ Hava durumu bilgisi getiriliyor...`});

        await weather.find({search: `${location}`, degreeType: `${degree}`}, async function(err, result)
        {
            setTimeout(() =>
            {
                if(err)
                {
                    console.log(err);
                    interaction.editReply({content: `${err} | Komut zaman aşımına uğradı. Lütfen tekrar deneyiniz.`});
                }
                else
                {
                    if(result.length == 0)
                        return interaction.editReply({content: `${location} bölgesine ait bir hava durumu bulunamadı.`});
                    else
                    {
                        const temp = result[0].current.temperature;
                        const type = result[0].current.skytext;
                        const name = result[0].location.name;
                        const feel = result[0].current.feelslike;
                        const icon = result[0].current.imageUrl;
                        const wind = result[0].current.winddisplay;
                        const day = result[0].current.day;
                        const alert = result[0].location.alert || 'None';

                        const embed = new EmbedBuilder()
                        .setColor('Blue')
                        .setTitle(`${name} bölgesinin mevcut hava durumu`)
                        .addFields({name: 'Derece', value: `${temp}`})
                        .addFields({name: 'Hissedilen', value: `${feel}`})
                        .addFields({name: 'Hava', value: `${type}`})
                        .addFields({name: 'Mevcut Uyarılar', value: `${alert}`})
                        .addFields({name: 'Gün', value: `${day}`})
                        .addFields({name: 'Rüzgar hızı & Yönü', value: `${wind}`})
                        .setThumbnail(icon)

                        interaction.editReply({content: '', embeds: [embed]});
                    }
                }
            }, 2000)
        })
    }
}