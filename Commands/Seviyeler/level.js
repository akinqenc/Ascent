const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');
const Levels = require("discord.js-leveling");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Bir üyenin seviyesini ayarla.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
        subcommand.setName("add")
        .setDescription("Bir üyeye seviye ekle")
        .addUserOption(option =>
            option.setName("target")
            .setDescription("Bir üye seç.")
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("amount")
            .setDescription("Seviye miktarını seç.")
            .setMinValue(0)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("remove")
        .setDescription("Bir üyenin seviyesini sil")
        .addUserOption(option =>
            option.setName("target")
            .setDescription("Bir üye seç.")
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("amount")
            .setDescription("Seviye miktarını seç.")
            .setMinValue(0)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("set")
        .setDescription("Bir üyenin seviyesini ayarla")
        .addUserOption(option =>
            option.setName("target")
            .setDescription("Bir üye seç.")
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("amount")
            .setDescription("Seviye miktarını seç.")
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
                    await Levels.appendLevel(target.id, guildId, amount);
                    embed.setDescription(`${target} adlı üyeye ${amount} seviye eklenmiştir.`).setColor("Green").setTimestamp();
                    break;
                case "remove":
                    await Levels.subtractLevel(target.id, guildId, amount);
                    embed.setDescription(`${target} adlı üyeden ${amount} seviye çıkarılmıştır.`).setColor("DarkGreen").setTimestamp();
                    break;
                case "set":
                    await Levels.setLevel(target.id, guildId, amount);
                    embed.setDescription(`${target} adlı üyenin seviyesi ${amount} olarak ayarlanmıştır.`).setColor("Yellow").setTimestamp();
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