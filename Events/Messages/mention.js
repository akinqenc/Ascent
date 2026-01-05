const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports =
{
    name: 'messageCreate',
    async execute(message, client)
    {
        async function sendMessage(reply)
        {
            const embed = new EmbedBuilder()
            .setColor('DarkVividPink')
            .setTitle('Yardıma mı ihtiyacın var?')
            .setDescription('/help yazarak beni kullanmaya başlayabilirsin. Deneyebileceğin ve kullanabileceğin bir çok özelliğim var :)')
            .setTimestamp()

            if(!reply)
                await message.reply({embeds: [embed]});
            else
            {
                embed.setFooter({text: `Bu mesajın gönderilmesini istemediysen delete butonuna tıkla`});

                const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('replymsgDelete')
                    .setLabel(`🗑️`)
                    .setStyle(ButtonStyle.Danger)
                )
                
                const msg = await message.reply({embeds: [embed], components: [button]});
                const collector = await msg.createMessageComponentCollector();
                collector.on('collect', async i => {
                    if(i.customId == 'replymsgDelete')
                        await msg.delete();
                });
            }
        }

        if(message.mentions.users.first() == client.user)
        {
            if(message.reference)
            {
                await sendMessage(true);
            }
            else
            {
                await sendMessage();
            }
        }
    }
}