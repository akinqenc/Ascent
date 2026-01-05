const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Bir üyenin banını kaldır")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option => 
            option.setName("userid")
            .setDescription("Banını kaldırmak istediğin üyenin ID bilgisini gir")
            .setRequired(true)
        ),

        async execute(interaction)
        {
            const {channel, options} = interaction;

            const userId = options.getString("userid");

            try
            {
                await interaction.guild.members.unban(userId);

                const embed = new EmbedBuilder()
                    .setDescription(`ID bilgisi ${userId} olan kullanıcının banını kaldırdın`)
                    .setColor(0x5fb041)
                    .setTimestamp();

                await interaction.reply({
                    embeds: [embed],
                });
            }
            catch(err)
            {
                console.log(err);

                const errEmbed = new EmbedBuilder()
                    .setDescription("Geçerli bir ID giriniz.")
                    .setColor(0xc72c3b)
                
                interaction.reply({embeds: [errEmbed], ephemeral: true});

            }
        }
    }