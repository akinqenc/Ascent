const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Bir üyeyi sunucudan at")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option => 
            option.setName("hedef")
            .setDescription("Şutlanacak üyeyi seç")
            .setRequired(true)
        )
    .addStringOption(option =>
            option.setName("neden")
            .setDescription("Atılma nedeni")
        ),

        async execute(interaction)
        {
            const {channel, options} = interaction;

            const user = options.getUser("hedef");
            const reason = options.getString("neden") || "Neden belirtilmedi";

            const member = await interaction.guild.members.fetch(user.id);

            try{
                await member.kick(reason);

                const embed = new EmbedBuilder()
                .setDescription(`${user} şutlandı. Atılma nedeni: ${reason}`);
    
                await interaction.reply({
                    embeds: [embed],
                });
            }
            catch (e)
            {
                const errEmbed = new EmbedBuilder()
                .setDescription(`${user.username} kullanıcısını atamazsın. Çünkü o yüce bir insan ;)`)
                .setColor(0xc72c3b)

                await interaction.reply({embeds: [errEmbed]});
            }
        }
}