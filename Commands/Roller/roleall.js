const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('role-all')
    .setDescription('Bir rolü herkese ata')
    .addRoleOption(option =>
        option.setName('role').setDescription('Herkese atamak istediğin rol')
        .setRequired(true)
    ),

    async execute(interaction)
    {
        const {options, guild} = interaction;
        const members = await guild.members.fetch();
        const role = options.getRole('role');

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return await interaction.reply({content: `Bunu yapabilmek için yetkin yok.`, ephemeral: true});
        else
        {
            await interaction.reply({content: `💥 Herkese ${role.name} rolü veriliyor. Bu biraz zaman alabilir...`});

            let num = 0;
            setTimeout(() =>
            {
                members.forEach(async m => {
                    m.roles.add(role).catch(err =>
                        {
                            return;
                        });
                        num++;

                        const embed = new EmbedBuilder()
                        .setColor('Blue')
                        .setDescription(`✔️ ${num} üye artık ${role.name} rolüne sahip`)

                        await interaction.editReply({content: ``, embeds: [embed]});
                })
            }, 100)
        }
    }
}