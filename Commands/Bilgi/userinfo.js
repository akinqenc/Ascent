const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Bir üyenin bilgilerini getir")
    .addUserOption(option =>
        option.setName("user")
        .setDescription("Bir üye seç")
        .setRequired(true)
    ),

    async execute(interaction)
    {
        const {options} = interaction;
        const user = options.getUser("user") || interaction.user;
        const member = await interaction.guild.members.cache.get(user.id);
        const icon = user.displayAvatarURL();
        const tag = user.tag;

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setAuthor({name: tag, iconURL: icon})
        .addFields(
            {name: "İsim", value: `${user}`, inline: false},
            {name: "Roller", value: `${member.roles.cache.map(r => r).join(" ")}`, inline: false},
            {name: "Sunucuya katıldığı tarih", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true},
            {name: "Discord'a katıldığı tarih", value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`, inline: true}
        )
        .setFooter({text: `Kullanıcı ID: ${user.id}`})
        .setTimestamp()

        await interaction.reply({embeds: [embed]});
    }
}