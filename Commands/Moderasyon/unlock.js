const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const LockSchema = require("../../Models/Lock");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Bir kanalı kilidini kaldır")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    
    async execute(interaction, client)
    {
        const {guild, channel} = interaction;

        const embed = new EmbedBuilder()
        if(channel.permissionsFor(guild.id).has("SendMessages"))
            return interaction.reply({embeds: [embed.setColor("Red").setDescription("Bu kanal kilitli değil.")], ephemeral: true});
        
        channel.permissionOverwrites.edit(guild.id, {
            SendMessages: null,
        });

        await LockSchema.deleteOne({ChannelID: channel.id})

        interaction.reply({embeds: [embed.setDescription("Kilitleme işlemi kaldırıldı.").setColor("Green")]});
    }
}