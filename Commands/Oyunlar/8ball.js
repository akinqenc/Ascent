const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription('8ball için bir soru sor')
    .addStringOption(option => option.setName('question').setDescription('*Sorunu gir').setRequired(true)),
  timeout: 10000,

  async execute(interaction) {

    const { client, guild } = interaction;
    const question = interaction.options.getString("question");

    const choice = ["Boşveeer",
      "Hadi valo",
      "Velet velet sorular sorma ya",
      "Sorduğun soruya bir dön de bak",
      "Seyirci joker hakkımı kullanmak istiyorum",
      "Ne yazmışsın gözlerim görmüyor",
      "Boşu bırak",
      "İyi",
      "Evet",
      "Onu bunu bırak da iş nasıl gidiyor?",
      "Boş bir soru, lütfen tekrar deneyin",
      "Sorunu aklında tut, şimdi işim var",
      "Söylemesem daha iyi",
      "Şimdi düşünemiyorum",
      "Depresyondayım, sonra yine gel",
      "Bana bu kadar kolay güvenmemelisin",
      "Bilmiyorum",
      "Kaynaklarıma bakmam lazım",
      "Şimdi boşver soruyu falan ya gel valo",
      "Anlat anlat",
      "Hmm şüpheli"]

    const ball = Math.round((Math.random() * choice.length))

    const embed = new EmbedBuilder()

    await interaction.reply({
      embeds: [
        embed.setTitle(`"${question}"`)
          .setDescription(`**\`\`\`${choice[ball]}\`\`\`**`)
          .setColor("#C74327")
          .setImage("https://media.tenor.com/5lLcKZgmIhgAAAAC/american-psycho-patrick-bateman.gif")
      ]
    }).catch(err => {
      interaction.reply({ embeds: [embed.setTitle("8ball Yuvarlama Başarısız!").setColor("0x2f3136").setDescription(":warning: | Bir sorun oluştu. Daha sonra tekrardeneyiniz :(").setTimestamp()] })
    })
  },
}