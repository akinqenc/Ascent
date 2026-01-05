const {
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");
  const rpsDB = require("../../Models/rps");
  module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
      const { member, guildId, customId, message, user, guild } =
        interaction;
  
      if (!interaction.isButton()) return;
   const rps = rpsDB.findOne({ Guild: guild.id, User: user.id });
      if (!rps) {
        return;
      }
      if (rps) {
        if (customId == "r" || customId == "p" || customId == "s") {
          let action = ["Taş", "Kağıt", "Makas"];
          let action2 = `${action[Math.floor(Math.random() * action.length)]}`;
          let msg = await message.fetch(rps.RPSM);
          let button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("e")
              .setLabel("Taş")
              .setStyle(ButtonStyle.Success)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("z")
              .setLabel("Kağıt")
              .setStyle(ButtonStyle.Danger)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("t")
              .setLabel("Makas")
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true)
          );
  
          switch (customId) {
            case "r":
              const tie = new EmbedBuilder()
                .setTitle("Oyun Bitti")
                .setDescription("Oyun **BERABERE** bitti")
                .setThumbnail(
                    "https://cdn.discordapp.com/attachments/1028538200425246733/1063095543129198642/download.png"
                  )
                .setColor("Random");
              const win = new EmbedBuilder()
                .setTitle("Oyun Bitti")
                .setDescription("Bot, oyunu **KAZANDI**")
                .setThumbnail(
                    "https://cdn.discordapp.com/attachments/1028538200425246733/1063095028198686730/game-with-glitch-effect_225004-661.webp"
                  )
                .setColor("Random");
              const lost = new EmbedBuilder()
                .setTitle("Oyun Bitti")
                .setDescription(`<@${interaction.user.id}>, oyunu **KAZANDI**`)
                .setThumbnail(
                    "https://cdn.discordapp.com/attachments/1028538200425246733/1063095402464825405/you-win-lettering-pop-art-text-banner_185004-60.webp"
                  )
                .setColor("Random");
  
              if (action2 == "Taş")
                return msg
                  .edit({
                    embeds: [tie],
                    components: [button],
                  })
                  .then(() => {
                    interaction.reply({
                      content: `${action2} seçtim | BERABERE`,
                      ephemeral: true,
                    });
                  });
  
              if (action2 == "Kağıt")
                return msg
                  .edit({
                    embeds: [win],
                    components: [button],
                  })
                  .then(() => {
                    interaction.reply({
                      content: `${action2} seçtim | KAZANDIM`,
                      ephemeral: true,
                    });
                  });
              if (action2 == "Makas")
                return msg
                  .edit({
                    embeds: [lost],
                    components: [button],
                  })
                  .then(() => {
                    interaction.reply({
                      content: `${action2} seçtim | KAYBETTİM`,
                      ephemeral: true,
                    });
                  });
              await rpsDB.findOneAndDelete({
                Guild: guild.id,
                User: user.id,
              });
              break;
            case "p":
              const tie2 = new EmbedBuilder()
                .setTitle("Oyun Bitti")
                .setDescription("Oyun **BERABERE** bitti")
                .setThumbnail(
                    "https://cdn.discordapp.com/attachments/1028538200425246733/1063095543129198642/download.png"
                  )
                .setColor("Random");
              const win2 = new EmbedBuilder()
                .setTitle("Oyun Bitti")
                .setDescription("Bot, oyunu **KAZANDI**")
                .setThumbnail(
                    "https://cdn.discordapp.com/attachments/1028538200425246733/1063095028198686730/game-with-glitch-effect_225004-661.webp"
                  )
                .setColor("Random");
              const lost2 = new EmbedBuilder()
                .setTitle("Oyun Bitti")
                .setDescription(`<@${interaction.user.id}>, oyunu **KAZANDI**`)
                .setThumbnail(
                    "https://cdn.discordapp.com/attachments/1028538200425246733/1063095402464825405/you-win-lettering-pop-art-text-banner_185004-60.webp"
                  )
                .setColor("Random");
  
              if (action2 == "Kağıt")
                return msg
                  .edit({
                    embeds: [tie2],
                    components: [button],
                  })
                  .then(() => {
                    interaction.reply({
                      content: `${action2} seçtim | BERABERE`,
                      ephemeral: true,
                    });
                  });
  
              if (action2 == "Makas")
                return msg
                  .edit({
                    embeds: [win2],
                    components: [button],
                  })
                  .then(() => {
                    interaction.reply({
                      content: `${action2} seçtim | KAZANDIM`,
                      ephemeral: true,
                    });
                  });
              if (action2 == "Taş")
                return msg
                  .edit({
                    embeds: [lost2],
                    components: [button],
                  })
                  .then(() => {
                    interaction.reply({
                      content: `${action2} seçtim | KAYBETTİM`,
                      ephemeral: true,
                    });
                  });
              await rpsDB.findOneAndDelete({
                Guild: guild.id,
                User: user.id,
              });
              break;
            case "s":
              const tie3 = new EmbedBuilder()
                .setTitle("Oyun Bitti")
                .setDescription("Oyun **BERABERE** bitti")
                .setThumbnail(
                    "https://cdn.discordapp.com/attachments/1028538200425246733/1063095543129198642/download.png"
                  )
                .setColor("Random");
              const win3 = new EmbedBuilder()
                .setTitle("Oyun Bitti")
                .setDescription("Bot, oyunu **KAZANDI**")
                .setThumbnail(
                    "https://cdn.discordapp.com/attachments/1028538200425246733/1063095028198686730/game-with-glitch-effect_225004-661.webp"
                  )
                .setColor("Random");
              const lost3 = new EmbedBuilder()
                .setTitle("Oyun Bitti")
                .setDescription(`<@${interaction.user.id}>, oyunu **KAZANDI**`)
                .setThumbnail(
                    "https://cdn.discordapp.com/attachments/1028538200425246733/1063095402464825405/you-win-lettering-pop-art-text-banner_185004-60.webp"
                  )
                .setColor("Random");
  
              if (action2 == "Makas")
                return msg
                  .edit({
                    embeds: [tie3],
                    components: [button],
                  })
                  .then(() => {
                    interaction.reply({
                      content: `${action2} seçtim | BERABERE`,
                      ephemeral: true,
                    });
                  });
  
              if (action2 == "Taş")
                return msg
                  .edit({
                    embeds: [win3],
                    components: [button],
                  })
                  .then(() => {
                    interaction.reply({
                      content: `${action2} seçtim | KAZANDIM`,
                      ephemeral: true,
                    });
                  });
              if (action2 == "Kağıt")
                return msg
                  .edit({
                    embeds: [lost3],
                    components: [button],
                  })
                  .then(() => {
                    interaction.reply({
                      content: `${action2} seçtim | KAYBETTİM`,
                      ephemeral: true,
                    });
                  });
              await rpsDB.findOneAndDelete({
                Guild: guild.id,
                User: user.id,
              });
              break;
          }
        }
      }
    }
  }