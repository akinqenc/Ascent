const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ComponentType,
  } = require("discord.js");
  const rpsDB = require("../../Models/rps");
  const ms = require("ms");
  module.exports = {
    Cooldown: false,
    data: new SlashCommandBuilder()
      .setName("tkm")
      .setDescription("Taş Kağıt Makas"),
    /**
     *
     * @param { ChatInputCommandInteraction } interaction
     */
    async execute(interaction) {
      const { guild, user, customId, message } = interaction;
      const Data = await rpsDB.findOne({ Guild: guild.id, User: user.id });
      if (Data) {
        return interaction.reply({
          content:
            "Görünüşe göre zaten bir oyuna başlamışsınız, lütfen eski oyunun bitmesi için 10 saniye bekleyin.",
          ephemeral: true,
        });
      }
      if (!Data) {
        const rps = new EmbedBuilder()
          .setTitle("Oyun Başladı!")
          .setDescription("Taş Kağıt Makas?")
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/1034828306362683412/1062797609661640734/hands-playing-rock-paper-scissors-game-flat-design-style-vector-illustration_540284-598.webp"
          )
          .setColor("Random");
  
        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("r")
            .setLabel("Taş")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("p")
            .setLabel("Kağıt")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId("s")
            .setLabel("Makas")
            .setStyle(ButtonStyle.Primary)
        );
  
        const Page = await interaction.reply({
          content: "Taş Kağıt Makas?",
          embeds: [rps],
          components: [buttons],
          fetchReply: true,
        });
        const m = Page.id;
  
        if (!Data)
          await rpsDB.create({
            guild: guild.id,
            User: user.id,
            RPSM: m,
          });
  
        const col = await Page.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: ms("10s"),
        });
        col.on("collect", async (i) => {
          if (i.user.id !== user.id) {
            return i.reply({
              content: "Bu senin oyunun değil weled",
              ephemeral: true,
            });
          }
        });
        col.on("end", async (collected) => {
          if (collected.size === 0) {
            const rps2 = new EmbedBuilder()
              .setTitle("Oyun Bitti!")
              .setDescription(
                `Oyun bitti çünkü <@${user.id}> zamanında cevap vermedi.`
              )
              .setThumbnail(
                "https://cdn.discordapp.com/attachments/1028538200425246733/1063095028198686730/game-with-glitch-effect_225004-661.webp"
              )
              .setColor("Random");
            const button = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("x")
                .setLabel("Taş")
                .setStyle(ButtonStyle.Success)
                .setDisabled(true),
              new ButtonBuilder()
                .setCustomId("q")
                .setLabel("Kağıt")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true),
              new ButtonBuilder()
                .setCustomId("l")
                .setLabel("Makas")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true)
            );
            await interaction.editReply({
              content: "Zamanında cevap vermedin.",
              embeds: [rps2],
              components: [button],
            });
            await rpsDB.findOneAndDelete({ Guild: guild.id, User: user.id });
          }
        });
      }
    },
  };
  