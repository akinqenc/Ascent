const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('mass-unban')
    .setDescription('Herkesin banını kaldırır')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction)
    {
        const {options, guild} = interaction;
        const users = await interaction.guild.bans.fetch();
        const ids = users.map(u => u.user.id);

        if(!users) return await interaction.reply({content: `Sunucuda banlanmış kimse yok.`, ephemeral: true});

        await interaction.reply({content: `👀 Herkesin banı kaldırılıyor, çok fazla banlanmış kişi var ise bu işlem biraz zaman alabilir...`});

        for(const id of ids)
        {
            await guild.members.unban(id)
            .catch(err => 
                {
                    return interaction.editReply({content: `${err.rawError}`});
                });
        }

        const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`✅ ${ids.length} üyenin banı, sunucudan **kaldırılmıştır**`)

        await interaction.editReply({content: ``, embeds: [embed]});
    }
}