const { MatchPairs } = require('discord-gamecord');
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("eslestirme")
    .setDescription("Eslestirme oyununu oyna")
    .setDMPermission(false),

    async execute(interaction) {

        const Game = new MatchPairs({
        message: interaction,
        isSlashGame: false,
        embed: {
            title: 'Eşleştirme',
            color: '#5865F2',
            description: '**Butonlara tıklayarak emojileri eşleştir**'
        },
        timeoutTime: 60000,
        emojis: ['🍉', '🍇', '🍊', '🥭', '🍎', '🍏', '🥝', '🥥', '🍓', '🫐', '🍍', '🥕', '🥔'],
        winMessage: '**Kazandın!**',
        loseMessage: '**Kabettin!**',
        playerOnlyMessage: 'Sadece {player} butonları kullanabilir'
        });

        Game.startGame();
        Game.on('gameOver', result => {
        console.log(result);  // =>  { result... }
        });
    }
}