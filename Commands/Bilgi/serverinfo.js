const {SlashCommandBuilder, EmbedBuilder, ChannelType, GuildVerificationLevel, GuildExplicitContentFilter, GuildNSFWLevel} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Sunucu hakkında bilgi al.")
    .setDMPermission(false),

    async execute(interaction)
    {
        const {guild} = interaction;
        const {members, channels, emojis, roles, stickers} = guild;

        const sortedRoles = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position);
        const userRoles = sortedRoles.filter(role => !role.managed);
        const managedRoles = sortedRoles.filter(role => role.managed);
        const members2 = await members.fetch();
        const bots = members2.filter(member => member.user.bot);

        const myBotId = '1068084479161290802';
        const otherBots = bots.filter(bot => bot.user.id !== myBotId);

        const botCount = otherBots.size + 1;

        const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
            let totalLength = 0;
            const result = [];

            for(const role of roles)
            {
                const roleString = `<@&${role.id}`;

                if(roleString.length + totalLength > maxFieldLength)
                    break;

                totalLength += roleString.length + 1
                result.push(roleString);
            }

            return result.length;
        }

        const splitPascal = (string, separator) => string.split(/(?=[A-U])/).join(separator);
        const toPascalCase = (string, separator = false) => {
            const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
            return separator ? splitPascal(pascal, separator) : pascal;
        };

        const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;

        const totalChannels = getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildNews, ChannelType.GuildVoice, ChannelType.GuildStageVoice, ChannelType.GuildForum, ChannelType.GuildCategory]);

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`${guild.name} sunucusunun bilgileri`)
        .setThumbnail(guild.iconURL({size: 1024}))
        .setImage(guild.bannerURL({size: 1024}))
        .addFields(
            {name: "Açıklama", value: `💬 ${guild.description || "Yok"}`},

            {
                name: "Genel",
                value: [
                    `📅 **Sununun Kurulma Tarihi** <t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
                    `💳 **ID** ${guild.id}`,
                    `👑 **Kurucu** <@${guild.ownerId}>`,
                    `🗺️ **Dil** ${new Intl.DisplayNames(["tr"], {type: "language"}).of(guild.preferredLocale)}`,
                    `💎 **Ozel sunucu URL'si** ${guild.vanityURLCode || "Yok"}`
                ].join("\n")
            },

            {name: "Özellikler", value: guild.features?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "Yok", inline: true},
            
            {name: "Güvenlik",
                value: [
                    `🔞 **NSFW** ${splitPascal(GuildNSFWLevel[guild.nsfwLevel], " ")}`,
                    `🔐 **Doğrulama** ${splitPascal(GuildVerificationLevel[guild.verificationLevel], " ")}`
                ].join("\n"),
                inline: true
            },

            {name: `Üye (${guild.memberCount})`,
                value: [
                    `👪 **Kullanıcılar** ${guild.memberCount - botCount}`,
                    `🤖 **Botlar** ${botCount}`
                ].join("\n"),
                inline: true
            },

            {name: `Kullanıcı rolleri (${maxDisplayRoles(userRoles)} / ${userRoles.length})`, value: `${userRoles.slice(0,maxDisplayRoles(userRoles)).join(" ") || "Yok"}`},
            {name: `Bot rolleri (${maxDisplayRoles(managedRoles)} / ${managedRoles.length})`, value: `${managedRoles.slice(0,maxDisplayRoles(managedRoles)).join(" ") || "Yok"}`},
            
            {name: `Kanal ve Kategoriler (${totalChannels})`,
                value: [
                    `💬 **Metin kanalları** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildNews])}`,
                    `🔈 **Ses kanalları** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
                    `📁 **Kategoriler** ${getChannelTypeSize([ChannelType.GuildCategory])}`,
                ].join("\n"),
                inline: true
            },

            {name: `Emojiler ve Çıkartmalar (${emojis.cache.size + stickers.cache.size})`,
                value: [
                    `🟢 **Animasyonlu** ${emojis.cache.filter(emoji => emoji.animated).size}`,
                    `🔵 **Statik** ${emojis.cache.filter(emoji => !emoji.animated).size}`,
                    `🃏 **Çıkartmalar** ${stickers.cache.size}`,
                ].join("\n"),
                inline: true
            },

            {name: "Nitro",
                value: [
                    `🚀 **Seviye** ${guild.premiumTier || "Yok"}`,
                    `🔮 **Sunucu takviyesi** ${guild.premiumSubscriptionCount}`,
                    `💎 **Takviyeciler** ${guild.members.cache.filter(member => member.roles.premiumSubscriberRole).size}`,
                    `🏋️‍♀️ **Toplam Takviyeciler** ${guild.members.cache.filter(member => member.roles.premiumSince).size}`
                ].join("\n"),
                inline: true
            }
        )

        interaction.reply({embeds: [embed]});
    }
}