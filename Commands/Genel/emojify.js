const {SlashCommandBuilder} = require('discord.js');
const { options } = require('superagent');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('emojify')
    .setDescription('Yazıları emojiye dönüştür')
    .addStringOption(option =>
        option.setName("text")
        .setDescription("dönüştürülecek yazı")
        .setMaxLength(2000)
        .setMinLength(1)
        .setRequired(true)
        )
    .addStringOption(option =>
        option.setName("hidden")
        .setDescription("Bu mesajı gizle?")
        .addChoices({name: 'Gizli', value:'true'},
                    {name: 'Gizli degil', value: 'false'})
        .setRequired(false)
        ),

        async execute(interaction)
        {
            const{options} = interaction;
            const text = options.getString('text');
            const hidden = options.getString('hidden') || false;

            if(hidden == 'true') hidden = true;
            else if(hidden == 'false') hidden = false;

            var emojiText = text
            .toLowerCase()
            .split('')
            .map((letter) =>
            {
                const regex = /^[A-Za-z]+$/;
                if (letter == ' ') return ' ';

                if(regex.test(letter)) return `:regional_indicator_${letter}:`
                else return letter;
            })
            .join('');

            if(emojiText.length >= 2000) emojiText = 'Bu yazı çok uzun. Bunu dönüştüremem :(';

            await interaction.reply({content: emojiText, ephemeral: hidden});
        }
}