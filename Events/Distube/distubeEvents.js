const { ButtonBuilder, ActionRowBuilder, SlashCommandBuilder, ButtonStyle } = require("discord.js");

const { musicCard } = require("musicard");

const fs = require("fs");
const client = require("../../index");

const status = (queue) =>
  `Ses Seviyesi: \`${queue.volume}%\` | Filtreler: \`${queue.filters.names.join(", ") || "Kapalı"}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? "Queue" : "Bu Şarkı") : "Kapalı"}\` | Otomatik Onyatma: \`${queue.autoplay ? "Açık" : "Kapalı"}\``;

async function sendMusicCard(queue, song) {
  const card = new musicCard()
    .setName(song.name)
    .setAuthor(`By ${song.user.username}`)
    .setColor("auto")
    .setTheme("classic")
    .setBrightness(50)
    .setThumbnail(song.thumbnail)
    .setProgress(10)
    .setStartTime("0:00")
    .setEndTime(song.formattedDuration);

  const cardBuffer = await card.build();
  fs.writeFileSync(`musicard.png`, cardBuffer);

  const pauseButton = new ButtonBuilder()
    .setCustomId("pause")
    .setLabel("Duraklat")
    .setStyle(ButtonStyle.Secondary);

  const resumeButton = new ButtonBuilder()
    .setCustomId("resume")
    .setLabel("Devam Ettir")
    .setStyle(ButtonStyle.Secondary);

  const skipButton = new ButtonBuilder()
    .setCustomId("skip")
    .setLabel("Geç")
    .setStyle(ButtonStyle.Danger);

  const stopButton = new ButtonBuilder()
    .setCustomId("stop")
    .setLabel("Durdur")
    .setStyle(ButtonStyle.Primary);

  const volumeUpButton = new ButtonBuilder()
    .setCustomId("volumeUp")
    .setLabel("Ses Arttır")
    .setStyle(ButtonStyle.Success);

  const volumeDownButton = new ButtonBuilder()
    .setCustomId("volumeDown")
    .setLabel("Ses Azalt")
    .setStyle(ButtonStyle.Danger);

  const repeat = new ButtonBuilder()
    .setCustomId("repeat")
    .setLabel("Tekrarla")
    .setStyle(ButtonStyle.Danger);

  const shuffle = new ButtonBuilder()
    .setCustomId("shuffle")
    .setLabel("Karıştır")
    .setStyle(ButtonStyle.Danger);

  const row1 = new ActionRowBuilder()
    .addComponents(pauseButton, resumeButton, skipButton, stopButton);

  const row2 = new ActionRowBuilder()
    .addComponents(volumeUpButton, volumeDownButton, shuffle, repeat);

  queue.textChannel.send({
    components: [row1, row2],
    files: [`musicard.png`],
  }).then((message) => {
    queue.currentMessage = message;
  });
}

client.distube
  .on('playSong', async (queue, song) => {
    if (queue.currentMessage) {
      queue.currentMessage.delete().catch(console.error);
      queue.currentMessage = undefined;
    }

    await sendMusicCard(queue, song);
  })
  .on('addSong', (queue, song) => {
    queue.textChannel.send(`🎶 ${song.name} eklendi - \`${song.formattedDuration}\` => ${song.user} tarafından`);
  })
  .on('addList', (queue, playlist) => {
    queue.textChannel.send(`🎶 \`${playlist.name}\` oynatma listesi (${playlist.songs.length}) eklendi\n${status(queue)}`);
  })
  .on('error', (channel, e) => {
    console.error(e);
  })
  .on('empty', (channel) => {
    channel.send('⛔ Ses kanalı boş. Kanaldan çıkılıyor...');
  })
  .on('searchNoResult', (message, query) => {
    message.channel.send(`⛔ \`${query}\` Bir sonuç bulunamadı!`);
  })
  .on('finish', (queue) => {
    queue.textChannel.send('🏁 Liste bitti').then((message) => {
      queue.currentMessage = message;
    });
  });

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const filter = (i) => ["pause", "resume", "skip", "stop", "volumeUp", "volumeDown", "shuffle", "repeat"].includes(i.customId) && i.user.id === interaction.user.id;

  if (filter(interaction)) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) return;

    if (interaction.customId === "pause") {
      client.distube.pause(interaction.guild);
      await interaction.update({ content: "⏸ Müzik duraklatıldı" });
    } else if (interaction.customId === "resume") {
        try{
            if (!queue.pause) {
                await interaction.update({ content: "▶️ Müzik duraklatılmadı", ephemeral: true });
              } else {
                client.distube.resume(interaction.guild);
                await interaction.update({ content: "▶️ Müzik devam ediyor" });
              }
        }
        catch(e)
        {
            console.log(e);
        }
    } else if (interaction.customId === "skip") {
      if (queue.songs.length <= 1) {
        await interaction.update({ content: "⚠️ Listede müziği atlayabileceğim kadar şarkı yok", ephemeral: true });
      } else {
        client.distube.skip(interaction.guild);
        await interaction.update({ content: "⏭️ Müzik atlandı" });
      }
    } else if (interaction.customId === "stop") {
      client.distube.stop(interaction.guild);
      await interaction.update({ content: "⏹️ Müzik durduruldu" });
    } else if (interaction.customId === "volumeUp") {
      if (queue.volume >= 100) {
        await interaction.update({ content: "🔊 Ses Seviyesi zaten (%100)" });
      } else {
        const newVolume = Math.min(queue.volume + 10, 100);
        client.distube.setVolume(interaction.guild, newVolume);
        await interaction.update({ content: `🔊 Ses Seviyesi şu seviyeye çıkarıldı: ${newVolume}%` });
      }
    } else if (interaction.customId === "volumeDown") {
      if (queue.volume <= 0) {
        await interaction.update({ content: "🔉 Ses Seviyesi zaten (0%)" });
      } else {
        const newVolume = Math.max(queue.volume - 10, 0);
        client.distube.setVolume(interaction.guild, newVolume);
        await interaction.update({ content: `🔉 Ses Seviyesi şu seviyeye düşürüldü: ${newVolume}%` });
      }
    } else if (interaction.customId === "shuffle") {
      if (!queue.songs.length || queue.songs.length === 1) {
        await interaction.update({ content: "⚠️ Listede karışık çalabileceğim şarkı(lar) yok" });
      } else {
        client.distube.shuffle(interaction.guild);
        await interaction.update({ content: "🔀 Liste karışık çalınıyor" });
      }
    } else if (interaction.customId === "repeat") {
      if (!queue.songs.length) {
        await interaction.update({ content: "⚠️ Tekrarlanacak şarkı yok" });
      } else {
        const repeatMode = queue.repeatMode;
        client.distube.setRepeatMode(interaction.guild, repeatMode === 0 ? 1 : 0);
        await interaction.update({ content: `🔁 Tekrarlama özelliği şu seviyede: ${repeatMode === 0 ? "liste" : "kapalı"}` });
      }
    }
    if (queue.songs.length == 0)
    {
      client.distube.stop(interaction.guild);
    }
  }
});