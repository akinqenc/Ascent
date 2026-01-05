const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Bir şarkı çal")
    .addStringOption(option =>
      option.setName("query")
        .setDescription("Şarkının adını ya da URL'sini gir")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;

    const query = options.getString("query");
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed.setColor("#457cf0").setDescription("Müzik komutlarını kullanabilmek için bir ses kanalında olman gerekiyor");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed.setColor("#457cf0").setDescription(`Hali hazırda kullanımda olan müzik botunu böyle kullanamazsın <#${guild.members.me.voice.channelId}>`);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      client.distube.play(voiceChannel, query, { textChannel: channel, member: member });

      interaction.reply({ content: "🎶 İstek alındı", ephemeral: true });

    } catch (err) {
      console.log(err);

      embed.setColor("#457cf0").setDescription("⛔ | Bir hata oluştu...");

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};