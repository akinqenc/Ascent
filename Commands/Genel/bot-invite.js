const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, OAuth2Scopes} = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('bot-invite')
    .setDescription('Botu davet etmek için özel davet kodu oluştur')
    .addStringOption(option =>
        option.setName('permissions')
        .setDescription('Ekleyeceğin botun izinleri')
        .addChoices(
            {name: 'Sunucuyu Görüntüleme(Moderatörlük yok)', value: `517547088960`},
            {name: 'Düşük Moderatörlük', value: `545195949136`},
            {name: 'Üst Düzey Moderatörlük', value: `545195949174`},
            {name: 'Yönetici', value: `8`}
        )
        .setRequired(true)
    ),

    async execute(interaction, client)
    {
        const {options} = interaction;
        const perms = options.getString('permissions');

        const link = client.generateInvite({
            scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
            permissions: [perms],
        });

        const embed = new EmbedBuilder()
        .setColor('Aqua')

        if(perms !== '8') embed.setDescription(`⚔️ Seçtiğin izinleri kullanarak bir davet kodu oluşturdum! İzinlere bakmak istersen, davet koduna tıkla ve bir sunucu seç. \n \n⚠️ Botun tüm fonksiyonlarına erişebilmek için **Yönetici izinleri** gerekebilir! \n \n> ${link}`);
        else embed.setDescription(`⚔️ Seçtiğin izinleri kullanarak bir davet kodu oluşturdum! İzinlere bakmak istersen, davet koduna tıkla ve bir sunucu seç. \n \n> ${link}`);

        await interaction.reply({embeds: [embed], ephemeral: true});
    }
}