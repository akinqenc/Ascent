const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');
const Levels = require("discord.js-leveling");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("xp")
    .setDescription("Bir üyenin xp'sini ayarla.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
        subcommand.setName("add")
        .setDescription("Bir üyeye xp ekle")
        .addUserOption(option =>
            option.setName("target")
            .setDescription("Bir üye seç.")
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("amount")
            .setDescription("XP miktarını seç.")
            .setMinValue(0)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("remove")
        .setDescription("Bir üyenin xp'sini sil")
        .addUserOption(option =>
            option.setName("target")
            .setDescription("Bir üye seç.")
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("amount")
            .setDescription("XP miktarını seç.")
            .setMinValue(0)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("set")
        .setDescription("Bir üyenin xp'sini ayarla")
        .addUserOption(option =>
            option.setName("target")
            .setDescription("Bir üye seç.")
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("amount")
            .setDescription("XP miktarını seç.")
            .setMinValue(0)
            .setRequired(true)
        )
    ),

    async execute(interaction)
    {
        const {options, guildId}= interaction;

        const sub = options.getSubcommand();
        const target = options.getUser("target");
        const amount = options.getInteger("amount");
        const embed = new EmbedBuilder();

        try
        {
            switch(sub)
            {
                case "add":
                    await Levels.appendXp(target.id, guildId, amount);
                    embed.setDescription(`${target} adlı üyeye ${amount} xp eklenmiştir.`).setColor("Green").setTimestamp();
                    break;
                case "remove":
                    await Levels.subtractXp(target.id, guildId, amount);
                    embed.setDescription(`${target} adlı üyeden ${amount} xp çıkarılmıştır.`).setColor("DarkGreen").setTimestamp();
                    break;
                case "set":
                    await Levels.setXp(target.id, guildId, amount);
                    embed.setDescription(`${target} adlı üyenin xp'si ${amount} olarak ayarlanmıştır.`).setColor("Yellow").setTimestamp();
                    break;
            }
        }
        catch (err)
        {
            console.log(err);
        }

        interaction.reply({embeds: [embed], ephemeral: true});
    }
}