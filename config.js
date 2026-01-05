module.exports = {

    giveawayManager: {
        privateMessageInformation: true,
        everyoneMention: false,
        reaction: '🎉'
    },

    messages: {
        giveaway: '🎉 **Çekiliş**',
        giveawayEnded: '🎉 **Çekiliş Sonlandı**',
        title: 'Ödül: {this.prize}',
        drawing: 'Çekilişin bitmesine kalan süre: {timestamp}',
        dropMessage: '1.olma şansını yakalamak için 🎉 tepkisine tıkla!',
        inviteToParticipate: 'Çekilişe katılmak için 🎉 tepkisine tıkla!',
        winMessage: 'Tebrikler, {winners}! **{this.prize}** kazandın!',
        embedFooter: '{this.winnerCount} kazanan(lar)',
        noWinner: 'Çekiliş iptal edildi, katılan üye yok :(',
        hostedBy: 'Kim tarafından: {this.hostedBy}',
        winners: 'Kazanan(lar):',
        endedAt: 'Bitiş süresi',
        paused: '⚠️ **Bu çekiliş duraklatıldı!**',
        infiniteDurationText: '`NEVER`',
        congrat: 'Yeni Kazanan(lar): {winners}! Tebrikler, ödülünüz: **{this.prize}**!',
        error: 'Tekrar çekme iptal edildi, katılan üye yok :('
    }
}