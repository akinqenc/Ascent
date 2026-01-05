const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const reminderSchema = require('../../Models/remind');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Bir hatırlatıcı oluştur')
    .addSubcommand(command =>
        command.setName('set')
        .setDescription('Bir hatırlatıcı ekle')
        .addStringOption(option =>
            option.setName('reminder')
            .setDescription('Neyin hatırlatılmasını istersin?')
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('minutes')
            .setDescription('Kaç dakika sonra hatırlatılsın?')
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(59)
        )
        .addIntegerOption(option =>
            option.setName('hours')
            .setDescription('Kaç saat sonra hatırlatılsın?')
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(12)
        )
        .addIntegerOption(option =>
            option.setName('days')
            .setDescription('Kaç gün sonra hatırlatılsın?')
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(31)
        )
    ),

    async execute(interaction)
    {
        const{options, guild, user} = interaction;
        const reminder = options.getString('reminder');
        const minute = options.getInteger('minutes') || 0;
        const hour = options.getInteger('hours') || 0;
        const day = options.getInteger('days') || 0;

        let time = Date.now() + 
        (day * 1000 * 60 * 60 * 24) + 
        (hour * 1000 * 60 * 60) + 
        (minute * 1000 * 60);

        await reminderSchema.create({
            User: interaction.user.id,
            Time: time,
            Remind: reminder
        });

        const embed = new EmbedBuilder()
        .setColor('White')
        .setDescription(`📑 Hatırlatıcın kuruldu. <t:${Math.floor(time/1000)}:R> sonra ${reminder} hatırlatacağım.`)

        await interaction.reply({embeds: [embed], ephemeral: true});
    }
}