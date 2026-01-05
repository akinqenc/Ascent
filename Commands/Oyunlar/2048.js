const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { TwoZeroFourEight } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("2048")
        .setDescription("2048 oyununu oyna")
        .setDMPermission(false),
    async execute(interaction) {
        const Game = new TwoZeroFourEight({
            message: interaction,
            slash_command: true,
            embed: {
                title: '2048',
                color: '#2f3136'
            },
            emojis: {
                up: '⬆️',
                down: '⬇️',
                left: '⬅️',
                right: '➡️',
            },
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            playerOnlyMessage: 'Sadece {player} butonları kullanabilir'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
        });
    }
}