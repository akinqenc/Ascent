const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName("rules")
    .setDescription('kurallar')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {

        const embedStart = new EmbedBuilder()
        .setTitle("Kodlar 💻")
        .setDescription("Kodları almak için butona tıklayabilirsiniz.")
        .setColor("Gold");

        const rulesButton = new ButtonBuilder()
          .setCustomId("rules_button")
          .setLabel("Kodlar")
          .setStyle("Primary");

        const timezoneButton = new ButtonBuilder()
        .setCustomId("timezone_button")
        .setLabel("Timezone")
        .setStyle("Primary");

        const rpcbot = new ButtonBuilder()
        .setCustomId("rpcbot_button")
        .setLabel("GTAVI Oynuyor")
        .setStyle("Warning");
    
        const row = new ActionRowBuilder().addComponents(rulesButton, timezoneButton, rpcbot);

        const linkButton = new ButtonBuilder()
        .setLabel("Kodlar")
        .setStyle("Link")
        .setURL("https://linkler.site/2BRZU");

        const linkButton2 = new ButtonBuilder()
            .setLabel("Timezone")
            .setStyle("Link")
            .setURL("https://linkler.site/2Cc9v");

        const linkButton3 = new ButtonBuilder()
            .setLabel("GTAVI Durumu")
            .setStyle("Link")
            .setURL("https://linkler.site/2Cczp");

        const buttonRow = new ActionRowBuilder().addComponents(linkButton);
        const buttonRow2 = new ActionRowBuilder().addComponents(linkButton2);
        const buttonRow3 = new ActionRowBuilder().addComponents(linkButton3);
    
        await interaction.channel.send({embeds: [embedStart], components: [row] });
    
        const filter1 = (buttonInteraction) => {
          return buttonInteraction.customId === "rules_button" && buttonInteraction.isButton();
      };
      
      const collector = interaction.channel.createMessageComponentCollector({ filter: filter1 });

        if(filter1)
        {
          const embed = new EmbedBuilder()
          .setTitle("Slash Komut Paketi")
          .setDescription("Slash Komut Paketi, Discord.js v14 botları için temel pakettir. Discord botu yapmaya çalışıyorsanız bu paketi kullanın! Ve merak etmeyin, daha fazlası yakında gelecek :)")
          .setColor("#0099FF")
  
          collector.on("collect", async (buttonInteraction) => {
            await buttonInteraction.reply({ embeds: [embed], components: [buttonRow], ephemeral: true});
          });
      
          collector.on("end", (collected) => {
            console.log(`Koleksiyon bitti: ${collected.size}`);
          });
        }

        const filter2 = (buttonInteraction) => {
          return buttonInteraction.customId === "timezone_button" && buttonInteraction.isButton();
      };
      
      const collector2 = interaction.channel.createMessageComponentCollector({ filter: filter2 });

        if(filter2)
        {
          const embed = new EmbedBuilder()
          .setTitle("Timezone Paketi")
          .setDescription("Timezone Paketi ile dünyadaki diğer ülkelerin value değerleri ve isimlerini hızlı yoldan almak için tılayın")
          .setColor("#0099FF")

          collector2.on("collect", async (buttonInteraction) => {
              await buttonInteraction.reply({ embeds: [embed], components: [buttonRow2], ephemeral: true});
          });

          collector2.on("end", (collected) => {
              console.log(`Koleksiyon 2 bitti: ${collected.size}`);
          });
        }


        const filter3 = (buttonInteraction) => {
          return buttonInteraction.customId === "rpcbot_button" && buttonInteraction.isButton();
        };
        const collector3 = interaction.channel.createMessageComponentCollector({ filter: filter3 });

        if(filter3)
        {
          const embed = new EmbedBuilder()
          .setTitle("Durum Değiştirme Bot Paketi")
          .setDescription("Özelleştirilebilir durum ile arkadaşlarınıza küçük şaka yapabilirsiniz")
          .setColor("#0099FF")

          collector3.on("collect", async (buttonInteraction) => {
              await buttonInteraction.reply({ embeds: [embed], components: [buttonRow3], ephemeral: true});
          });

          collector3.on("end", (collected) => {
              console.log(`Koleksiyon 3 bitti: ${collected.size}`);
          });
        }
    }
}
