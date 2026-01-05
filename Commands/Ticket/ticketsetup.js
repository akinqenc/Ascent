const {Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType} = require("discord.js");
const TicketSetup = require("../../Models/TicketSetup");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticketsetup")
        .setDescription("Ticket oluştur")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option =>
            option.setName("kanal")
            .setDescription("Ticketların hangi kanalda oluşturulacağını seçin.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option =>
            option.setName("kategori")
            .setDescription("Ticketların hangi kategori sınıfında oluşturulacağını seçin.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption(option =>
            option.setName("transkript")
            .setDescription("Transkriptlerin hangi kanalda oluşturulacağını seçin.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addRoleOption(option =>
            option.setName("rol")
            .setDescription("Ticket'lara inceleyecek rolü seçiniz.")
            .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName("herkes")
            .setDescription("herkesi '@everyone' yazarak etiketleyiniz.")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("açıklama")
            .setDescription("Ticket için bir açıklama seçiniz.")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("ilkbuton")
            .setDescription("Format: (Butonun adı, Emoji)")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("ikincibuton")
            .setDescription("Format: (Butonun adı, Emoji)")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("üçüncübuton")
            .setDescription("Format: (Butonun adı, Emoji)")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("dördüncübuton")
            .setDescription("Format: (Butonun adı, Emoji)")
            .setRequired(true)
        ),

    async execute(interaction)
    {
        const {guild, options} = interaction;

        try
        {
            const channel = options.getChannel("kanal");
            const category = options.getChannel("kategori");
            const transcripts = options.getChannel("transkript");

            const handlers = options.getRole("rol");
            const everyone = options.getRole("herkes");

            const description = options.getString("açıklama");
            const firstbutton = options.getString("ilkbuton").split(",");
            const secondbutton = options.getString("ikincibuton").split(",");
            const thirdbutton = options.getString("üçüncübuton").split(",");
            const fourthbutton = options.getString("dördüncübuton").split(",");

            const emoji1 = firstbutton[1];
            const emoji2 = secondbutton[1];
            const emoji3 = thirdbutton[1];
            const emoji4 = fourthbutton[1];

            await TicketSetup.findOneAndUpdate(
                {GuildID: guild.id},
                {
                    Channel: channel.id,
                    Category: category.id,
                    Transcripts: transcripts.id,
                    Handles: handlers.id,
                    Everyone: everyone.id,
                    Description: description,
                    Buttons: [firstbutton[0], secondbutton[0], thirdbutton[0], fourthbutton[0]]
                },
                {
                    new: true,
                    upsert: true,
                }
            );

            const button = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId(firstbutton[0]).setLabel(firstbutton[0]).setStyle(ButtonStyle.Danger).setEmoji(emoji1),
                new ButtonBuilder().setCustomId(secondbutton[0]).setLabel(secondbutton[0]).setStyle(ButtonStyle.Secondary).setEmoji(emoji2),
                new ButtonBuilder().setCustomId(thirdbutton[0]).setLabel(thirdbutton[0]).setStyle(ButtonStyle.Primary).setEmoji(emoji3),
                new ButtonBuilder().setCustomId(fourthbutton[0]).setLabel(fourthbutton[0]).setStyle(ButtonStyle.Success).setEmoji(emoji4),
            );

            const embed = new EmbedBuilder()
            .setDescription(description)

            await guild.channels.cache.get(channel.id).send({
                embeds: ([embed]),
                components: [
                    button
                ]
            });

            interaction.reply({ content: "Ticket başarıyla gönderildi.", ephemeral: true});
        }
        catch (err)
        {
            console.log(err);
            const errEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bir hata oluştu...");

            return interaction.reply({embeds: [errEmbed], ephemeral: true});
        }
    }
}