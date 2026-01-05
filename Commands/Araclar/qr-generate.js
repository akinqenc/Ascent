const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const axios = require('axios');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('qr-code')
    .setDescription('QR Kod oluşturma')
    .addStringOption(option =>
        option.setName('url')
        .setDescription("QR Kod için bir URL")
        .setRequired(true)
    ),

    async execute(interaction)
    {
        await interaction.deferReply({ephemeral: false});

        const {options} = interaction;
        const url = options.getString('url');

        const input =
        {
            method: 'GET',
            url: 'https://codzz-qr-cods.p.rapidapi.com/getQrcode',
            params: 
            {
                type: 'url',
                value: url
            },
            headers: {
                'X-RapidAPI-Key': '728b40cb7fmsha1b0aa2c8d9df54p10d368jsn55826d4bfe89',
                'X-RapidAPI-Host': 'codzz-qr-cods.p.rapidapi.com'
            }
        };

        try
        {
            const response = await axios.request(input);

            const embed = new EmbedBuilder()
            .setColor('Purple')
            .setImage(response.data.url)

            await interaction.editReply({embeds: [embed]});
        }
        catch (e) {
            console.log(e);
            await interaction.editReply({content: `Bu URL geçerli değil. Lütfen geçerli bir URL deneyiniz`});
        }
    }
}