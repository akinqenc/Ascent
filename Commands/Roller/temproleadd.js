const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const tempRoleSchema = require("../../Models/Role");
const scheduleRoleRemoval = require("../../Functions/scheduleRoleRemoval");

function formatTimestamp(date)
{
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    return `<t:${unixTimestamp}:R>`
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName("temproleadd")
    .setDescription("Geçici olarak bir rolü, bir üyeye ata")
    .addUserOption(option =>
        option.setName("user")
        .setDescription("Rol eklenecek üye")
        .setRequired(true)
        )
    .addRoleOption(option =>
        option.setName("role")
        .setDescription("Üyeye eklenecek rol")
        .setRequired(true)
        )
    .addIntegerOption(option =>
        option.setName("duration")
        .setDescription("Kaç dakika")
        .setRequired(true)
        )
    .addBooleanOption(option =>
        option.setName("dm")
        .setDescription("Üyeye geçici rol hakkında DM gönderilsin mi?")
        .setRequired(false)
        ),

        async execute(interaction)
        {
            try
            {
                const user = interaction.options.getUser("user");
                const role = interaction.options.getRole("role");
                const duration = interaction.options.getInteger("duration");
                const member = await interaction.guild.members.fetch(user.id);
                const dm = interaction.options.getBoolean("dm") || false;
                const expiresAt = new Date(Date.now() + duration * 60000);

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

                    await interaction.reply({ embeds: [embed], ephemeral: true});
                    return;
                }

                await interaction.guild.members.cache.get(user.id).roles.add(role);

                const tempRole = new tempRoleSchema({
                    guildId: interaction.guild.id,
                    userId: user.id,
                    roleId: role.id,
                    expiresAt,
                });

                await tempRole.save()

                scheduleRoleRemoval(interaction.client, user.id, role.id, interaction.guild.id, expiresAt);

                if(dm)
                {
                    const timestamp = formatTimestamp(expiresAt);
                    const message = `${interaction.guild.name} sunucusunda ${duration} dakikalığına geçici olarak \`${role.name}\` rolüne atandınız. `
                    try
                    {
                        await user.send(message);
                    }
                    catch
                    {
                        console.error(`${user.id} üyesine DM gönderilirken bir sorun oluştu: ${error}`)
                    }
                }

                const timestamp = formatTimestamp(expiresAt);

                const embed = new EmbedBuilder()
                .setColor("#00ff00")
                .setDescription(
                    `\`${role.name}\` rolü ${duration} dakikalığına ${user.toString()} üyesine eklenmiştir. ${timestamp} olduğu zaman kaldırılacak.`
                )
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true}),
                })
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp()

                await interaction.reply({ embeds: [embed], ephemeral: true});
            }
            catch(error)
            {
                console.error(error)
                await interaction.reply({
                    content: "Kodu çalıştırırken bir hata meydana geldi.", ephemeral: true
                })
            }
        }
}