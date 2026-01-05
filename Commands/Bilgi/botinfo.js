const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const cpuStat = require("cpu-stat");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Bot hakkında bilgi al"),
    
    execute(interaction, client)
    {
        const days = Math.floor(client.uptime / 86400000);
        const hours = Math.floor(client.uptime / 3600000) % 24;
        const minutes = Math.floor(client.uptime / 60000) % 60;
        const seconds = Math.floor(client.uptime / 1000) % 60;

        cpuStat.usagePercent(function (error, percent)
        {
            if(error) return interaction.reply({content: `${error}`});

            const memoryUsage = formatBytes(process.memoryUsage().heapUsed);
            const node = process.version;
            const cpu = percent.toFixed(2);

            const embed = new EmbedBuilder()
            .setTitle("Bot Bilgileri")
            .setColor("Blue")
            .addFields(
                {name: "Geliştirici", value: "Hermanos LP", inline: true},
                {name: "Kullanıcı Adı", value: `${client.user.username}`, inline: true},
                {name: "ID", value: `${client.user.id}`, inline: true},
                {name: "Kurulma Tarihi", value: "01.01.2023"},
                {name: "Yardım Komutu", value: "help", inline: true},
                {name: "Çalışma Süresi", value: ` \`${days}\` gün, \`${hours}\` saat, \`${days}\` dakika ve \`${seconds}\` saniye.`},
                {name: "Bot-Ping(ms)", value: `${client.ws.ping}ms`},
                {name: "Node versiyonu", value: `${node}`},
                {name: "CPU Kullanımı", value: `%${cpu}`, inline: true},
                {name: "Bellek Kullanımı", value: `${memoryUsage}`, inline: true}
            )

            interaction.reply({embeds: [embed]});
        })

        function formatBytes(a, b)
        {
            let c = 1024;
            d = b || 2;
            e = ['B','KB','MB','GB','TB',];
            f = Math.floor(Math.log(a) / Math.log(c))

            return parseFloat((a / Math.pow(c, f)).toFixed(d) + '' + e[f]);
        }
    }
}