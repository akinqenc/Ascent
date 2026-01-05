const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Google Çeviri')
    .addStringOption(option =>
        option.setName('message')
        .setDescription('Çevirilecek mesaj')
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('language')
        .setDescription('Hangi dile çevrilsin?')
        .addChoices(
            {name: 'English', value: 'en'},
            {name: 'Turkish', value: 'tr'},
            {name: 'French', value: 'fr'},
            {name: 'German', value: 'de'},
            {name: 'Italian', value: 'it'},
            {name: 'Portugese', value: 'pt'},
            {name: 'Spanish', value: 'es'},
            {name: 'Greek', value: 'gl'},
            {name: 'Russian', value: 'ru'},
            {name: 'Japanese', value: 'ja'},
            {name: 'Arabic', value: 'ar'}
        )
        .setRequired(true)
    ),

    async execute(interaction)
    {
        const {options} = interaction;
        const text = options.getString('message');
        const lang = options.getString('language');

        await interaction.reply({content: `⚙️ İstenen dile çeviriliyor...`, ephemeral: false});

        const applied = await translate(text, {to: `${lang}`});

        const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle(`✅ Çeviri Başarılı`)
        .addFields({name: `Girilen Yazı`, value: `\`\`\`${text}\`\`\``, inline: false})
        .addFields({name: `Çeviri Sonucu`, value: `\`\`\`${applied.text}\`\`\``, inline: false})

        await interaction.editReply({content: '', embeds: [embed], ephemeral: false});
    }
}