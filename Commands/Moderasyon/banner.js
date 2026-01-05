const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upload-banner')
        .setDescription('Botun bannerını günceller')
        .addAttachmentOption(option => option.setName('banner').setDescription('Banner resmi').setRequired(true)),
    async execute(interaction) {
        const authorizedId = '330031198648795146';

        if (interaction.user.id !== authorizedId) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkin yok', ephemeral: true });
        }

        const { options } = interaction;
        const bannerAttachment = options.getAttachment('banner');

        if (!bannerAttachment.contentType.startsWith("image/")) {
            return interaction.reply({ content: 'Lütfen bir dosya yükleyiniz', ephemeral: true });
        }

        try {
            const response = await fetch(bannerAttachment.url);
            const buffer = await response.buffer();
            let base64;
            if (bannerAttachment.contentType === 'image/gif') {
                base64 = buffer.toString('base64');
            } else {
                base64 = `data:${bannerAttachment.contentType};base64,${buffer.toString('base64')}`;
            }

            const client = interaction.client;

            const patchResponse = await fetch("https://discord.com/api/v10/users/@me", {
                method: "PATCH",
                headers: {
                    Authorization: `Bot ${client.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ banner: base64 }), 
            });

            if (!patchResponse.ok) throw new Error(`Banner yüklenirken bir hata oluştu: ${patchResponse.statusText}`);

            await interaction.reply({ content: 'Botun bannerı başarıyla güncellendi', ephemeral: true });
        } catch (error) {
            console.error("Error:", error);
            await interaction.reply({ content: `Botun bannerı güncellenirken bir sorun oluştu: ${error.message}`, ephemeral: true });
        }
    }
};
