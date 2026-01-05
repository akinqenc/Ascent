const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'giveawayReactionAdded',
    execute(giveaway, member, reaction) {
        return member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setTitle(`👏 Good job!`)
                    .setDescription(`Mükemmel,  [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) çekilişine katıldınız!\nÇekiliş ödülü: \`${giveaway.prize}\`\nBol şans!`)
            ]
        }).catch(() => { });
    }
}