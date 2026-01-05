const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const client = require("../../index");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playing")
        .setDescription("Yürütülen müziği göster."),

        async execute(interaction)
        {
            const {member, guild} = interaction;
            const voiceChannel = member.voice.channel;

            const embed = new EmbedBuilder();
            if(!voiceChannel)
            {
                embed.setColor("Red").setDescription("Müzik komutlarını çalıştırabilmek için bir ses kanalında olmalısın.");
                return interaction.reply({embeds: [embed], ephemeral: true});
            }

            if(!member.voice.channelId == guild.members.me.voice.channelId)
            {
                embed.setColor("Red").setDescription(`Müzik oynatıcısını kullanamazsın çünkü <#${guild.members.me.voice.channelId}> kanalında aktifim.`);
                return interaction.reply({embeds: [embed], ephemeral: true});
            }

            try
            {

                const queue = await client.distube.getQueue(voiceChannel);

                if(!queue)
                {
                    embed.setColor("Red").setDescription("Sırada bekleyen müzik yok.");
                    return interaction.reply({embeds: [embed], ephemeral: true});
                }

                const song = queue.songs[0];
                embed.setColor("Blue").setDescription(`🟢 **Şu anda oynatılıyor:** \`${song.name}\` - \`${song.formattedDuration}\`.\n**Link:** ${song.url}`).setThumbnail(song.thumbnail);
                return interaction.reply({embeds: [embed], ephemeral: true});
            }
            catch (err)
            {
                console.log(err);

                embed.setColor("NotQuiteBlack").setDescription("⚠️ | Bir sorun oluştu... 😢");
                
                return interaction.reply({embeds: [embed], ephemeral: true});
            }
        }
}