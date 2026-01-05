const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('change-avatar')
    .setDescription('Botun avatarını değiştir')
    .addAttachmentOption(option =>
        option.setName("avatar")
        .setDescription("Botun yeni avatarı").setRequired(true)
    ),

    async execute(interaction)
    {
        const {options, client} = interaction;
        const image = options.getAttachment('avatar');
        const avatar = image.url;

        if(interaction.user.id !== '330031198648795146') return await interaction.reply({content: `Sadece **geliştiriciler** bu komutu kullanabilir!`, ephemeral: true});

        await interaction.deferReply({ephemeral: true});

        const changed = await client.user.setAvatar(avatar).catch(err =>
        {
            interaction.editReply({content: `Bir hata oluştu ${err}`, ephemeral: true});
        });
        if(changed)
        {
            const embed = new EmbedBuilder()
            .setColor("DarkNavy")
            .setDescription('⚒️ Yeni avatar ayarlandı')

            await interaction.editReply({embeds: [embed], ephemeral: true});
        }
        else return;
    }
}