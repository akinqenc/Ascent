const {SlashCommandBuilder, EmbedBuilder, ChannelType} = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('purge-links')
    .setDescription('Gönderilmiş linkleri siler(14 günden eskiler hariç)')
    .addChannelOption(option => 
        option.setName('channel')
        .setDescription('Hangi kanaldaki linkler silinsin?')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),

    async execute(interaction)
    {
        const {guild, options} = interaction;
        const channel = options.getChannel('channel') || interaction.channel;
        const messages = await channel.messages.fetch();

        await interaction.deferReply({ephemeral: true});

        let count = [];
        let response;
        await messages.forEach(async m => {
            if(m.content.includes('https://') || m.content.includes('discord.gg/') || m.content.includes('http://'))
            {
                await m.delete().catch(err => {});
                count++;
                response = true;

                const embed = new EmbedBuilder()
                .setColor('Green')
                .setDescription(`🖊️ **Link** içeren \`${count}\` tane mesaj sildim. Bu işlemin tamamlanması biraz zaman alabilir. Üzerinden 14 gün geçen linkleri silemiyorum`);

                await interaction.editReply({content: '', embeds: [embed], ephemeral: true});
            }
            else return;
        });

        if(response == true) return;
        else
            await interaction.editReply({content: `🤣 Bu kanalda silinecek hiçbir link yok. Unutma ki 14 gün ve eski tarihteki linkleri silemiyorum`});
    }
}