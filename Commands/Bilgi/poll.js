const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Belirlenen kanalda anket oluştur")
    .setDefaultMemberPermissions(PermissionFlagsBits.None)
    .addStringOption(option => 
            option.setName("anket")
            .setDescription("Anketi Açıkla")
            .setRequired(true)
        )
    .addChannelOption(option =>
            option.setName("kanal")
            .setDescription("Anketi hangi kanalda yapacaksın?")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        ),
    
    async execute(interaction)
    {
        const {options} = interaction;

        const channel = options.getChannel("kanal");
        const description = options.getString("anket");

        const embed = new EmbedBuilder()
        .setColor("Gold")
        .setDescription(description)
        .setTimestamp();

        try
        {
            const m = await channel.send({embeds: [embed]});
            await m.react("✅");
            await m.react("❌");
            await interaction.reply({content: "Anket, kanalda başarıyla oluşturuldu.", ephemeral: true});
        }
        catch (err)
        {
            console.log(err);
        }
    }
}