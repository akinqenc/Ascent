const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("channel-delete")
        .setDescription("Bir discord kanalı sil")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Silmek istediğin kanalı seç")
                .setRequired(true)
        ),

    async execute(interaction) {
        const { options } = interaction;

        const channel = options.getChannel("channel");

            try {
                await channel.delete();
                await interaction.reply({ content: "Kanal başarılı bir şekilde silindi.", ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: "Kanalı silerken bir hata oluştu.", ephemeral: true });
            }
    }
};
