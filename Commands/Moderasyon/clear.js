const {EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('İstediğin kadar mesajı sil')
    .setDefaultMemberPermissions(PermissionFlagsBits.None)
    .addIntegerOption(option =>
        option.setName('amount').
        setDescription("Silinecek mesaj sayısı").setMinValue(1).setMaxValue(200).setRequired(true)),

    async execute (interaction, client) {
        const {channel, options} = interaction;

        const amount = options.getInteger('amount');

        if(!amount)
            return await interaction.reply({ content: "Silinecek mesaj sayısını yazınız.", ephemeral: true});
        
        if(amount > 200 || amount < 1)
            return await interaction.reply({ content: "Lütfen 1 ile 200 arasında bir sayı seçiniz.", ephemeral: true});

        await channel.bulkDelete(amount).catch(err => {
            return;
        });

        
            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(`:white_check_mark: **${amount}** mesaj silindi`);

            await interaction.reply({embeds: [embed]}).catch(err => {
                return;
            });
    }
}