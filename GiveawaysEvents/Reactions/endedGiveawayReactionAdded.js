const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'endedGiveawayReactionAdded',
    execute(giveaway, member, reaction) {
        reaction.users.remove(member.user);
        return member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('🤔 Hata mı oldu?')
                    .setDescription(`Üzgünüz, bitmiş bir çekilişe katılmaya çalıştınız [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})!\nSanırım bir hata oldu`)
            ]
        }).catch(() => { });
    }
}