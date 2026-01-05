const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bir üyeyi banla")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option => 
            option.setName("hedef")
            .setDescription("Banalanacak üyeyi seç")
            .setRequired(true)
        )
    .addStringOption(option =>
            option.setName("neden")
            .setDescription("Banlanma nedeni")
        ),

    async execute(interaction)
    {
        const {channel, options} = interaction;

        const user = options.getUser("hedef");
        const reason = options.getString("neden") || "Neden belirtilmemiş";

        const member = await interaction.guild.members.fetch(user.id);

        try{
            
            await member.ban({reason});

            const embed = new EmbedBuilder()
            .setDescription(`${user} banlandı. Atılma nedeni: ${reason}`)
            .setColor(0x5fb041)
            .setTimestamp()
    
            await interaction.reply({
                embeds: [embed]
            });
        }
        catch (e)
            {
                const errEmbed = new EmbedBuilder()
                .setDescription(`${user.username} kullanıcısını banlayamazsın. Çünkü o yüce bir insan ;)`)
                .setColor(0xc72c3b)

                await interaction.reply({embeds: [errEmbed]});
            }
    }
}