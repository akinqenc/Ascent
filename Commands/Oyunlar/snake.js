const { Snake } = require('discord-gamecord');
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("yılan")
    .setDescription("Yılan oyunu oyna")
    .setDMPermission(false),

    async execute(interaction) {

        const Game = new Snake({
        message: interaction,
        isSlashGame: false,
        embed: {
            title: 'Yılan Oyunu',
            overTitle: 'Oyun Bitti',
            color: '#5865F2'
        },
        emojis: {
            board: '⬛',
            food: '🍎',
            up: '⬆️', 
            down: '⬇️',
            left: '⬅️',
            right: '➡️',
        },
        stopButton: 'Stop',
        timeoutTime: 60000,
        snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
        foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
        playerOnlyMessage: 'Sadece {player} butonları kullanabilir'
        });

        Game.startGame();
        Game.on('gameOver', result => {
        console.log(result);  // =>  { result... }
        });
    }
}
