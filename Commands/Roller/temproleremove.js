const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const tempRoleSchema = require("../../Models/Role");
const scheduleRoleAdd = require("../../Functions/scheduleRoleAdd");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("temproleremove")
    .setDescription("Geçici olarak bir rolü, bir üyeden çıkar")
    .addUserOption(option =>
        option.setName("user")
        .setDescription("Rol çıkarılacak üye")
        .setRequired(true)
        )
    .addRoleOption(option =>
        option.setName("role")
        .setDescription("Üyeden çıkarılacak rol")
        .setRequired(true)
        )
    .addIntegerOption(option =>
        option.setName("duration")
        .setDescription("Kaç dakika")
        .setRequired(true)
        ),

        async execute(interaction)
        {
                const user = interaction.options.getUser("user");
                const role = interaction.options.getRole("role");
                const duration = interaction.options.getInteger("duration");
                const member = await interaction.guild.members.fetch(user.id);
                const expiresAt = new Date(Date.now() + duration * 60000);

                if(!member.roles.cache.has(role.id))
                {
                    const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setDescription(`${user} zaten \`${role.name}\`rolüne sahip değil.`)
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true}),
                    })
                    .setFooter({ text: `Requested by ${interaction.user.tag}` })
                    .setTimestamp()

                    await interaction.reply({ embeds: [embed], ephemeral: true});
                    return;
                }

                await interaction.guild.members.cache.get(user.id).roles.remove(role);

                const tempRole = new tempRoleSchema({
                    guildId: interaction.guild.id,
                    userId: user.id,
                    roleId: role.id,
                    expiresAt,
                });

                await tempRole.save()

                scheduleRoleAdd(interaction.client, user.id, role.id, interaction.guild.id, expiresAt);


                const expiresAtUnix = Math.floor(expiresAt.getTime()/ 1000);
                const timestamp = `<t:${expiresAtUnix}:R>`

                const embed = new EmbedBuilder()
                .setColor("#00ff00")
                .setDescription(
                    `\`${role.name}\` rolü ${duration} dakikalığına ${user.toString()} üyesinden çıkarılmıştır. ${timestamp} olduğu zaman tekrar eklenecek.`
                )
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true}),
                })
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp()

                await interaction.reply({ embeds: [embed], ephemeral: true});
        }
}