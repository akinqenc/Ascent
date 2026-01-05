const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("channel-create")
        .setDescription("Bir discord kanalı oluştur.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(option =>
            option.setName("channeltype")
                .setDescription("Kanalın türünü ayarla.")
                .setRequired(true)
                .addChoices(
                    { name: "text channel", value: "textchannel" },
                    { name: "Voice channel", value: "voicechannel" }
                )
        )
        .addStringOption(option =>
            option.setName("channelname")
                .setDescription("Kanalı belirle.")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName("parent")
                .setDescription("Kanalın nerede oluşacağını belirle.")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addRoleOption(option =>
            option.setName("everyone")
                .setDescription("'@everyone' yaz")
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName("permission-role")
                .setDescription("Kanala erişebilecek rol(ler)")
                .setRequired(false)
        ),

    async execute(interaction) {
        const { guild, options } = interaction;

        const { ViewChannel, ReadMessageHistory, SendMessages, Connect, Speak } = PermissionFlagsBits;

        const channeltype = options.getString("channeltype");
        const channelname = options.getString("channelname");
        const parent = options.getChannel("parent");
        const permissions = options.getRole("permission-role");
        const everyone = options.getRole("everyone");

        let permissionOverwrites = [];

        // everyone'a izin ver
        permissionOverwrites.push({
            id: everyone,
            allow: [ViewChannel, SendMessages, ReadMessageHistory]
        });

        // Eğer belirli bir rol seçildiyse, o role özel izinleri ekle
        if (permissions) {
            permissionOverwrites.push({
                id: permissions,
                allow: [ViewChannel, SendMessages, ReadMessageHistory]
            });
            permissionOverwrites.push({
                id: everyone,
                deny: [ViewChannel, SendMessages, ReadMessageHistory]
            });
        }

        if (channeltype === "textchannel") {
            await guild.channels.create({
                name: `${channelname}`,
                type: ChannelType.GuildText,
                parent: parent,
                permissionOverwrites: permissionOverwrites
            });
        } else if (channeltype === "voicechannel") {
            await guild.channels.create({
                name: `${channelname}`,
                type: ChannelType.GuildVoice,
                parent: parent,
                permissionOverwrites: permissionOverwrites
            });
        }

        await interaction.reply({ content: "Kanal başarılı bir şekilde oluşturuldu.", ephemeral: true });
    }
}
