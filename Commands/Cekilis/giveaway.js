const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType} = require("discord.js");
const ms = require("ms");
const client = require("../../index");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Çekiliş sistemi")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
        subcommand.setName("start")
        .setDescription("🎁 Bir çekiliş başlat")
        .addStringOption(option => 
            option.setName("length")
            .setDescription("Çekilişin süresini belirleyin")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("prize")
            .setDescription("Kazanılacak ödülü belirleyin")
            .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName("winners")
            .setDescription("Kaç kişinin kazanacağını belirleyin (varsayılan = 1)")
            .setRequired(false)
        )
        .addChannelOption(option => 
            option.setName("channel")
            .setDescription("Çekilişin yapılacağı kanalı seçiniz. (Varsayılan = geçerli kanal)")
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("pause")
        .setDescription("⏸️ Çekilişi duraklatır")
        .addStringOption(option =>
            option.setName("message-id")
            .setDescription("Çekilişin mesaj id'sini belirtiniz")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("unpause")
        .setDescription("⏯️ Çekilişi devam ettirir")
        .addStringOption(option =>
            option.setName("message-id")
            .setDescription("Çekilişin mesaj id'sini belirtiniz")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("end")
        .setDescription("⏹️ Çekilişi bitirir")
        .addStringOption(option =>
            option.setName("message-id")
            .setDescription("Çekilişin mesaj id'sini belirtiniz")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("reroll")
        .setDescription("🔁 Çekiliş sonucunu tekrar çek")
        .addStringOption(option =>
            option.setName("message-id")
            .setDescription("Çekilişin mesaj id'sini belirtiniz")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("delete")
        .setDescription("❌ Çekilişi sil")
        .addStringOption(option =>
            option.setName("message-id")
            .setDescription("Çekilişin mesaj id'sini belirtiniz")
            .setRequired(true)
        )
    ),

    async execute(interaction)
    {
        const{options, channel, guildId} = interaction;

        const sub = options.getSubcommand();

        const errorEmbed = new EmbedBuilder().setColor("Red");
        const successEmbed = new EmbedBuilder().setColor("Green");

        if(sub === "start")
        {
            const gchannel = options.getChannel("channel") || channel;
            const duration = ms(options.getString("length"));
            const winnerCount = options.getInteger("winners") || 1;
            const prize = options.getString("prize");

            if(isNaN(duration))
            {
                errorEmbed.setDescription("Geçerli bir çekiliş süresi giriniz! `1d, 1h, 1m, 1s`!");
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            }

            return client.giveawaysManager.start(gchannel, {
                duration: duration,
                winnerCount,
                prize,
                messages: client.giveawayConfig.messages
            }).then(async () => {
                if(client.giveawayConfig.giveawayManager.everyoneMention)
                {
                    const msg = await gchannel.send("@everyone");
                    msg.delete();
                }
                successEmbed.setDescription(`Çekiliş ${gchannel} kanalında başladı.`)
                return interaction.reply({embeds: [successEmbed], ephemeral: true});
            }).catch((err) => {
                console.log(err);
                errorEmbed.setDescription(`Error \n\`${err}\``);
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            })
        }

        const messageId = options.getString("message-id");
        const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === guildId && g.messageId === messageId);
        if(!giveaway)
        {
            errorEmbed.setDescription(`Çekilişe ait ${messageId} ID veritabanında bulunamamıştır`);
            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
        }

        if(sub === "pause")
        {
            if(giveaway.isPaused)
            {
                errorEmbed.setDescription("Çekiliş zaten duraklatılmış.");
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            }
            await client.giveawaysManager.pause(messageId, {
                content: client.giveawayConfig.messages.paused,
                infiniteDurationText: client.giveawayConfig.messages.infiniteDurationText,
            }).then(() => {
                successEmbed.setDescription('⏸️ Çekiliş duraklatıldı.').setColor("Blue");
                return interaction.reply({embeds: [successEmbed], ephemeral: true});
            }).catch((err) => {
                console.log(err);
                errorEmbed.setDescription(`Error \n\`${err}\``);
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            });
        }

        if(sub === "unpause")
        {
            client.giveawaysManager.unpause(messageId).then(() => {
                successEmbed.setDescription('⏯️ Çekiliş devam ediyor.').setColor("Blue");
                return interaction.reply({embeds: [successEmbed], ephemeral: true});
            }).catch((err) => {
                console.log(err);
                errorEmbed.setDescription(`Error \n\`${err}\``);
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            });
        }

        if(sub === "end")
        {
            client.giveawaysManager.end(messageId).then(() => {
                successEmbed.setDescription('⏯️ Çekiliş bitti.').setColor("Blue");
                return interaction.reply({embeds: [successEmbed], ephemeral: true});
            }).catch((err) => {
                console.log(err);
                errorEmbed.setDescription(`Error \n\`${err}\``);
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            });
        }

        if(sub === "reroll")
        {
            await client.giveawaysManager.reroll(messageId, {
                messages: {
                    congrat: client.giveawayConfig.messages.congrat,
                    error: client.giveawayConfig.messages.error
                }
            }).then(() => {
                successEmbed.setDescription('Kazanan(lar) belli oldu.').setColor("Gold");
                return interaction.reply({embeds: [successEmbed], ephemeral: true});
            }).catch((err) => {
                console.log(err);
                errorEmbed.setDescription(`Error \n\`${err}\``);
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            });
        }
        if(sub === "delete")
        {
            await client.giveawaysManager.delete(messageId).then(() => {
                successEmbed.setDescription('❌ Çekiliş silindi').setColor("Red");
                return interaction.reply({embeds: [successEmbed], ephemeral: true});
            }).catch((err) => {
                console.log(err);
                errorEmbed.setDescription(`Error \n\`${err}\``);
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            });
        }
    }
}