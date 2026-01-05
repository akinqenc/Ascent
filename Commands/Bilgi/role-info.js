const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Belirtilen rolün bilgisini getir')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Bilgilerini öğrenmek istediğin rol')
                .setRequired(true)
        ),

    async execute(interaction) {
        const { options, guild } = interaction;
        const role = options.getRole('role');

        const name = role.name;
        const id = role.id;
        const color = role.color;
        const icon = role.iconURL();
        const pos = role.rawPosition;
        const mention = role.mentionable;

        const membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(role.id));

        const count = membersWithRole.size;

        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setThumbnail(icon)
            .addFields({ name: `Name`, value: `${name}` })
            .addFields({ name: `Rol ID`, value: `${id}` })
            .addFields({ name: `Renk`, value: `${color}` })
            .addFields({ name: `Etiketlenebilme`, value: `${mention}` })
            .addFields({ name: `Rol Pozisyonu`, value: `${pos}` })
            .addFields({ name: `Role Sahip Üye Sayısı`, value: `${count}` })
            .setFooter({ text: `Rol Bilgisi` })
            .setTimestamp();

        console.log(count);

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
