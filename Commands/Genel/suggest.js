const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, PermissionFlagsBits, ButtonStyle, ActionRowBuilder } = require('discord.js');
const suggestionSchema = require("../../Models/Suggestion");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suggest")
        .setDescription("Bir şey öner.")
        .addStringOption(option =>
            option.setName("seçenek")
                .setDescription("Bir seçenek seçiniz.")
                .setRequired(true)
                .addChoices(
                    { name: "Discord", value: "Discord" },
                    { name: "Servisler", value: "Services" },
                    { name: "Yeni Kanal", value: "Channel" },
                    { name: "Yeni Ortak Oyun", value: "Game" },
                    { name: "Diğer", value: "Other" },
                )
        )
        .addStringOption(option =>
            option.setName("açıklama")
                .setDescription("Önerinin açıklamasını giriniz.")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Hangi kanalda yapılsın")
                .setRequired(true)
        ),

    async execute(interaction) {
        const { guild, options, member, user, guildId } = interaction;

        const type = options.getString("seçenek");
        const description = options.getString("açıklama");

        const channel = options.getChannel("channel");

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: "Öneri", value: description, inline: false },
                { name: "Seçenek", value: type, inline: true },
                { name: "Durum:", value: "Bekliyor", inline: true },
            )
            .setTimestamp();

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("suggest-accept").setLabel("Onayla").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("suggest-decline").setLabel("Reddet").setStyle(ButtonStyle.Danger),
        );

        try {
            const m = await channel.send({ embeds: [embed], components: [buttons]});
            await channel.send({ content: "Önerini göndermek için `/suggest` kullan." });
            await interaction.reply({ content: "Önerin başarıyla iletildi.", ephemeral: true });

            const filter = (buttonInteraction) => buttonInteraction.customId === 'suggest-accept' || buttonInteraction.customId === 'suggest-decline';
            const buttonCollector = m.createMessageComponentCollector({ filter, time: 60000 });

            buttonCollector.on('collect', async (buttonInteraction) => {
                if (buttonInteraction.customId === 'suggest-accept') {
                } else if (buttonInteraction.customId === 'suggest-decline') {
                }
            });

            buttonCollector.on('end', collected => {
            });

            await suggestionSchema.create({
                GuildID: guildId, MessageID: m.id, Details: [
                    {
                        MemberID: member.id,
                        Type: type,
                        Suggestion: description
                    }
                ]
            });
        }
        catch (err) {
            console.error(err);
        }
    }
};