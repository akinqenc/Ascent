const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'giveawayReactionRemoved',
    execute(giveaway, member) {
        return member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('🤔 Çekilişten çekiliyor musun?')
                    .setDescription(`Farkettim ki [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) çekilinden çekilmişsin.\nÇekiliş ödülü: \`${giveaway.prize}\`.\nBu bir hata mı? Tekrar katılabilirsin!`)
            ]
        })
    }
}