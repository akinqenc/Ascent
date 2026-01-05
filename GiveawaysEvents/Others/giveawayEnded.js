const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'giveawayEnded',
    execute(giveaway, winners) {
        winners.forEach((winner) => {
            return winner.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('🎁 Tebrikler!')
                        .setDescription(`Tebrikler, [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) kazandınız!\nÖdülünüz: \`${giveaway.prize}\``)
                ]
            }).catch(() => { });
        });
    }
}