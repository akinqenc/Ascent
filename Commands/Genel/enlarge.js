const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios = require('axios');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('enlarge')
    .setDescription('Emojileri büyüt')
    .addStringOption(option =>
        option.setName('emoji').setDescription('büyütmek istediğin emoji').setRequired(true)
    ),

    async execute(interaction)
    {
        const {options} = interaction;

        let emoji = options.getString('emoji')?.trim();

        if(emoji.startsWith("<") && emoji.endsWith(">"))
        {
            const id = emoji.match(/\d{15,}/g)[0];

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
            .then(image => {
                if(image) return "gif";
                else return "png";
            }).catch(err => {
                return "png";
            })
            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }

        if(!emoji.startsWith("http"))
            return await interaction.reply({content: 'Standart discord emojilerini büyütemezsin'});
        
        if(!emoji.startsWith("https"))
            return await interaction.reply({content: 'Standart discord emojilerini büyütemezsin'});

        await interaction.reply({content: emoji});
    }
}