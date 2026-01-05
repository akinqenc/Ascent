const { FindEmoji } = require('discord-gamecord');
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("emojiyi-bul")
    .setDescription("Emojiyi bulma oyununu oyna")
    .setDMPermission(false),

    async execute(interaction)
    {
        const Game = new FindEmoji({
        message: interaction,
        isSlashGame: true,
        embed: {
            title: 'Emojiyi bul',
            color: '#5865F2',
            description: 'Aşağıdaki panodan emojileri unutmayın',
            findDescription: '{emoji} emojisini süre bitmeden bulun'
        },
        timeoutTime: 60000,
        hideEmojiTime: 5000,
        buttonStyle: 'PRIMARY',
        emojis: ['🍉', '🍇', '🍊', '🍋', '🥭', '🍎', '🍏', '🥝'],
        winMessage: 'Kazandın! Doğru emojiyi buldun. Emoji: {emoji}',
        loseMessage: 'Kaybettin! Yanlış emojiyi seçtin. Emoji: {emoji}',
        timeoutMessage: 'Kaybettin! Süren doldu. Emoji: {emoji}',
        });
    
        Game.startGame();
        Game.on('gameOver', result => {
        console.log(result);  // =>  { result... }
        });
    }

    

}