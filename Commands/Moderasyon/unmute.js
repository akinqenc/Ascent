const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require("discord.js");

module.exports =
{
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Bir üyenin zamanaşımını kaldır")
    .addUserOption(option => 
      option.setName("hedef")
        .setDescription("Zamanaşımı kaldırılacak üyeyi seç")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("neden")
        .setDescription("Neden")
        .setRequired(false)
    ),

  async execute(interaction) {
    const { guild, options } = interaction;

    const user = options.getUser("hedef");
    const timeMember = guild.members.cache.get(user.id);
    const reason = options.getString("neden") || "Neden belirtilmemiş";

    // Yetki Kontrolü
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return await interaction.reply({
        content: "Bu komutu kullanmaya yetkin yok",
        ephemeral: true,
      });

    // Kullanıcı Kontrolü
    if (!timeMember)
      return await interaction.reply({
        content: "Bu kullanıcı artık bu sunucuda değil.",
        ephemeral: true,
      });

    // Kendine Timeout Kontrolü
    if (interaction.member.id === timeMember.id)
    return await interaction.reply({
      content: "Kendinin zamanaşımını kaldıramazsın",
      ephemeral: true,
    });

    // Yetki Kontrolü (Yüksek Rol)
    if (!timeMember.kickable)
      return await interaction.reply({
        content: "Bu üyenin zamanaşımını kaldıramam. Onun rolü yüksek",
        ephemeral: true,
      });

    // Admin Kontrolü
    if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator))
      return await interaction.reply({
        content: "Zamanaşımı komutunu adminler üzerinde kullanamazsın",
        ephemeral: true,
      });

    // Zamanaşımı Kontrolü
    if (timeMember.communicationDisabledUntil === null) {
      return await interaction.reply({
        content: `**${user.tag}** üyesine zaten bir zamanaşımı uygulanmamış`,
        ephemeral: true,
      });
    }

    // Zamanaşımı Kaldırma
    await timeMember.timeout(null, reason);

    // Bilgilendirme Mesajları
    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Zamanaşımı Kaldırıldı")
      .addFields({ name: "Üye", value: `> ${user.tag}`, inline: true })
      .addFields({ name: "Neden", value: `> ${reason}`, inline: true })
      .setTimestamp();

    const dmembed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `✅ ${guild.name} sunucusunda zamanaşımın kaldırıldı. Durumu görüntülemek için sunucuya bakabilirsin. | ${reason}`
      );

    await timeMember.send({ embeds: [dmembed] }).catch((err) => {
      return;
    });

    await interaction.reply({ embeds: [embed] });
  },
};