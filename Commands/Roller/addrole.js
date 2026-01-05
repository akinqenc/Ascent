const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("add-role")
    .setDescription("Üyeyi bir role ata.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
        option.setName("user")
        .setDescription("Role eklenecek üye")
        .setRequired(true)
        )
    .addRoleOption(option => 
        option.setName("role")
        .setDescription("Üyenin ekleneceği rol")
        .setRequired(true)
        ),

    async execute(interaction, client)
    {
        const user = interaction.options.getUser("user");
        const role = interaction.options.getRole("role");
        const member = await interaction.guild.members.fetch(user.id);

        if(member.roles.cache.has(role.id))
        {
            const embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription(`${user} zaten \`${role.name}\`rolüne atanmış.`)
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true}),
            })
            .setFooter({ text: `Requested by ${interaction.user.tag}` })
            .setTimestamp()
            await interaction.reply({ embeds: [embed], ephemeral: true})
            return;
        }

        try
        {
            await interaction.guild.members.cache.get(user.id).roles.add(role)
            const embed = new EmbedBuilder()
            .setColor(role.color)
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true}),
            })
            .setDescription(`Üye \`${user.tag}\` başarılı bir şekilde \`${role.name}\` rolüne atandı.`)
            .setFooter({ text: `Requested by ${interaction.user.tag}` })
            .setTimestamp()

            await interaction.reply({embeds: [embed], ephemeral: true})
        }
        catch(error)
        {
            console.error(error)
            const embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setAuthor({
                name: interaction.name.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true}),
            })
            .setFooter({ text: `Requested by ${interaction.user.tag}` })
            .setTimestamp()
            .setDescription(`Üye \`${user.tag}\`, \`${role.name}\` rolüne eklenirken bir sorun oluştu.`)

            await interaction.reply({embeds: [embed], ephemeral: true})
        }
    }
}