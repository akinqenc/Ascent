const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Birinin profil avatarını png olarak çıkarır")
    .addUserOption(option =>
        option.setName("user")
        .setDescription("Seçilen üye")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("avatartype")
        .setDescription("Profil Avatarı / Sunucu Avatarı")
        .setRequired(true)
        .addChoices(
            {name: "Profile Avatar", value: "profile"},
            {name: "Server Avatar", value: "server"}
        )
    ),

    async execute(interaction) {

        const {options, guild} = interaction;

        const avatarType = options.getString("avatartype");
        const user = options.getUser("user");
        if(!user) return message.reply("Geçersiz kullanıcı");

        const member = guild.members.cache.get(user.id);

        if(avatarType == "server")
        {
            const banner = member.displayAvatarURL({dynamic: true, size: 4096});
            if(!banner) return message.reply(`🖼️・${user.username} adlı kişinin avatarı yok.`);

            const x64 = member.displayAvatarURL({ extension: "png", size: 64 });
            const x128 = member.displayAvatarURL({ extension: "png", size: 128 });
            const x256 = member.displayAvatarURL({ extension: "png", size: 256 });
            const x512 = member.displayAvatarURL({ extension: "png", size: 512 });
            const x1024 = member.displayAvatarURL({ extension: "png", size: 1024 });
            const x2048 = member.displayAvatarURL({ extension: "png", size: 2048 });

            const BannerEmbed = new EmbedBuilder()
            .setTitle(`${user.username} adlı üyenin avatarı`)
            .setColor("Random")
            .setImage(banner)
            .setDescription(
            `🖼️・\`${user.tag}\` avatarı`);
            const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("x64")
                    .setStyle(ButtonStyle.Link)
                    .setURL(x64),
                new ButtonBuilder()
                    .setLabel("x128")
                    .setStyle(ButtonStyle.Link)
                    .setURL(x128),
                new ButtonBuilder()
                    .setLabel("x256")
                    .setStyle(ButtonStyle.Link)
                    .setURL(x256)
            );
            const row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("x512")
                    .setStyle(ButtonStyle.Link)
                    .setURL(x512),
                new ButtonBuilder()
                    .setLabel("x1024")
                    .setStyle(ButtonStyle.Link)
                    .setURL(x1024),
                    new ButtonBuilder()
                    .setLabel("x2048")
                    .setStyle(ButtonStyle.Link)
                    .setURL(x2048)
            );
            interaction.reply({embeds: [BannerEmbed], components: [row1,row2]});
        }
        else if(avatarType == "profile")
        {
            const banner = user.displayAvatarURL({dynamic: true, size: 4096});
            if(!banner) return message.reply(`🖼️・${user.username} adlı kişinin avatarı yok.`);

            const x64 = user.displayAvatarURL({ extension: "png", size: 64 });
            const x128 = user.displayAvatarURL({ extension: "png", size: 128 });
            const x256 = user.displayAvatarURL({ extension: "png", size: 256 });
            const x512 = user.displayAvatarURL({ extension: "png", size: 512 });
            const x1024 = user.displayAvatarURL({ extension: "png", size: 1024 });
            const x2048 = user.displayAvatarURL({ extension: "png", size: 2048 });

            const BannerEmbed = new EmbedBuilder()
            .setTitle(`${user.username} adlı üyenin avatarı`)
            .setColor("Random")
            .setImage(banner)
            .setDescription(
            `🖼️・\`${user.tag}\` avatarı`);
            const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("x64")
                    .setStyle(ButtonStyle.Link)
                    .setURL(x64),
                new ButtonBuilder()
                    .setLabel("x128")
                    .setStyle(ButtonStyle.Link)
                    .setURL(x128),
                new ButtonBuilder()
                    .setLabel("x256")
                    .setStyle(ButtonStyle.Link)
                    .setURL(x256)
            );
            const row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("x512")
                    .setStyle(ButtonStyle.Link)
                    .setURL(x512),
                new ButtonBuilder()
                    .setLabel("x1024")
                    .setStyle(ButtonStyle.Link)
                    .setURL(x1024),
                    new ButtonBuilder()
                    .setLabel("x2048")
                    .setStyle(ButtonStyle.Link)
                    .setURL(x2048)
            );
            interaction.reply({embeds: [BannerEmbed], components: [row1,row2]});
        }
    }
}