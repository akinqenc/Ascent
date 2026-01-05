const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('timezone-converter')
    .setDescription('Farklı bölgelerdeki güncel saatler')
    .addStringOption(option =>
        option.setName('timezone')
        .setDescription('Saati gösterilecek bölge')
        .setRequired(true)
        .addChoices(
            {"name": "Canada Central Standard Time", "value": "America/Regina"},
            {"name": "Hawaiian Standard Time", "value": "Pacific/Honolulu"},
            {"name": "Pacific Standard Time", "value": "America/Los_Angeles"},
            {"name": "Central Standard Time", "value": "America/Chicago"},
            {"name": "Mexico Standard Time", "value": "America/Mexico_City"},
            {"name": "Eastern Standard Time", "value": "America/New_York"},
            {"name": "Central Europe Standard Time", "value": "Europe/Berlin"},
            {"name": "GMT Standard Time", "value": "Europe/London"},
            {"name": "W. Europe Standart Time", "value": "Europe/Amsterdam"},
            {"name": "South Africa Standart Time", "value": "Africa/Johannesburg"},
            {"name": "Russian Standart Time", "value": "Asia/Yekaterinburg"},
            {"name": "E. Africa Standard Time", "value": "Africa/Nairobi"},
            {"name": "Iran Standard Time", "value": "Asia/Tehran"},
            {"name": "FLE Standard Time", "value": "Europe/Helsinki"},
            {"name": "GTB Standard Time", "value": "Europe/Istanbul"},
            {"name": "Arabian Standard Time", "value": "Asia/Dubai"},
            {"name": "China Standard Time", "value": "Asia/Shanghai"},
            {"name": "Singapore Standard Time", "value": "Asia/Singapore"},
            {"name": "Taipei Standard Time", "value": "Asia/Taipei"},
            {"name": "Korea Standard Time", "value": "Asia/Seoul"},
            {"name": "Tokyo Standard Time", "value": "Asia/Tokyo"},
            {"name": "India Standard Time", "value": "Asia/Kolkata"},
            {"name": "Central Asia Standard Time", "value": "Asia/Almaty"},
            {"name": "A.U.S. Eastern Standard Time", "value": "Australia/Sydney"},
            {"name": "Central Pacific Standard Time", "value": "Pacific/Fiji"}

        )
    ),

    async execute(interaction)
    {
        await interaction.deferReply({ephemeral: true});

        const {options} = interaction;
        const timezone = options.getString('timezone');

        const utcDate = new Date();
        const locale = 'en-US';

        const localDate = utcDate.toLocaleString(locale, {timeZone: timezone});

        const embed = new EmbedBuilder()
        .setColor('Yellow')
        .setDescription(`🫧 ${timezone} ➡️ ${localDate}`)

        await interaction.editReply({embeds: [embed]});
    }
}