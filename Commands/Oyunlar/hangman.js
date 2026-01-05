const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { Hangman } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("hangman")
    .setDescription("Adam asmaca oyna")
    .setDMPermission(false)
    .addStringOption(option =>
        option.setName("word")
        .setDescription("Sormak istediğin kelimeyi yaz")
        .setRequired(true)
    ),
    async execute(interaction) {

        const {guild, options} = interaction;

        const word = options.getString("word");

        const Game = new Hangman({
        message: interaction,
        isSlashGame: true,
        embed: {
            title: 'Adam Asmaca',
            color: '#5865F2'
        },
        hangman: { hat: '🎩', head: '😟', shirt: '👕', pants: '🩳', boots: '👞👞' },
        mentionUser: true,
        customWord: `${word}`,
        timeoutTime: 60000,
        theme: 'winter',
        winMessage: `Kazandın! Kelime: **${word}**.`,
        loseMessage: `Kaybettin! Kelime: **${word}** .`,
        });

        Game.startGame();
        Game.on('gameOver', result => {
        console.log(result);  // =>  { result... }
        });
    }
}