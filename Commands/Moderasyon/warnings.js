const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const warningSchema = require("../../Models/Warning");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("Uyarı sistemi")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addSubcommand(subcommand =>
            subcommand.setName("add")
                .setDescription("Bir üyeyi uyar.")
                .addUserOption(option =>
                    option.setName("hedef")
                        .setDescription("Bir üye seç")
                        .setRequired(true)
                )
                .addStringOption(option => 
                    option.setName("neden")
                        .setDescription("Neden belirt.")
                        .setRequired(false)
                )
                .addStringOption(option => 
                    option.setName("kanıt")
                        .setDescription("Kanıt göster.")
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("check")
                .setDescription("Bir üyenin uyarılarını kontrol et.")
                .addUserOption(option =>
                    option.setName("hedef")
                        .setDescription("Bir üye seç")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("remove")
                .setDescription("Belirli bir üyenin bir uyarısını kaldır")
                .addUserOption(option =>
                    option.setName("hedef")
                        .setDescription("Bir üye seç")
                        .setRequired(true)
                )
                .addStringOption(option => 
                    option.setName("id")
                        .setDescription("Uyarının id numarasını gir.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("clear")
                .setDescription("Bir üyenin tüm uyarılarını sil.")
                .addUserOption(option =>
                    option.setName("hedef")
                        .setDescription("Bir üye seç")
                        .setRequired(true)
                )       
        ),

        async execute(interaction)
        {
            const {options, guildId, user, member} = interaction;

            const sub = options.getSubcommand(["add", "check", "remove", "clear"]);
            const target = options.getUser("hedef");
            const reason = options.getString("neden") || "Neden belirtilmedi.";
            const evidence = options.getString("kanıt") || "Kanıt belirtilmedi.";
            const warnId = options.getInteger(("id") - 1);
            const warnDate = new Date(interaction.createdTimestamp).toLocaleDateString();

            const userTag = `${options.getUser("hedef")} (${target.username})`;

            const embed = new EmbedBuilder();

            switch (sub)
            {
                case "add":
                    warningSchema.findOne({GuildID: guildId, UserID: target.id, User: userTag}, async(err, data) => {
                        if(err) throw err;

                        if(!data)
                        {
                            data = new warningSchema({
                                GuildID: guildId,
                                UserID: target.id,
                                User: userTag,
                                content: [
                                    {
                                        ExecuterId: user.id,
                                        ExecuterTag: user.tag,
                                        Reason: reason,
                                        Evidence: evidence,
                                        Date: warnDate
                                    }
                                ],
                            });
                        }
                        else
                        {
                            const warnContent = {
                                ExecuterId: user.id,
                                ExecuterTag: user.tag,
                                Reason: reason,
                                Evidence: evidence,
                                Date: warnDate
                            }
                            data.Content.push(warnContent);
                        }
                        data.save();
                    });

                    embed.setColor("Green")
                        .setDescription(
                            `Uyarı eklendi: ${userTag} | ||${target.id}||
                            **Neden**: ${reason}
                            **Kanıt**: ${evidence}`)
                        .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true}) })
                        .setTimestamp();

                    interaction.reply({embeds: [embed]});
                    break;

                case "check":
                    warningSchema.findOne({GuildID: guildId, UserID: target.id, User: userTag}, async(err, data) => {
                        if(err) throw err;

                        if(data)
                        {
                            embed.setColor("Green")
                            .setDescription(`${data.Content.map(
                                (w, i) =>
                                `**ID**: ${i + 1}
                                **Uyarılan kişi**: ${userTag}
                                **Kim tarafından**: ${w.ExecuterTag}
                                **Tarih**: ${w.Date}
                                **Neden**: ${w.Reason}
                                **Kanıt**: ${w.Evidence}\n\n
                                `
                            ).join(" ")}`)
                            .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true}) })
                            .setTimestamp();

                        interaction.reply({embeds: [embed]});
                        }
                        else
                        {
                            embed.setColor("Red")
                                .setDescription(`${userTag} | ||${target.id}|| hiç uyarısı yok.`)
                                .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true}) })
                                .setTimestamp()

                            interaction.reply({embeds: [embed]});
                        }
                    });
                    break;

                case "remove":
                    warningSchema.findOne({GuildID: guildId, UserID: target.id, User: userTag}, async(err, data) => {
                        if(err) throw err;

                        if(data)
                        {
                            data.Content.splice(warnId, 1);
                            data.save();

                            embed.setColor("Green")
                                .setDescription(`${userTag} uyarı id'si: ${warnId + 1} kaldırıldı.`)
                                .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true}) })
                                .setTimestamp()

                            interaction.reply({embeds: [embed]});
                        }
                        else
                        {
                            embed.setColor("Red")
                                .setDescription(`${userTag} | ||${target.id}|| hiç uyarısı yok.`)
                                .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true}) })
                                .setTimestamp()

                            interaction.reply({embeds: [embed]});
                        }
                    });
                    break;
                case "clear":
                    warningSchema.findOne({GuildID: guildId, UserID: target.id, User: userTag}, async(err, data) => {
                        if(err) throw err;

                        if(data)
                        {
                            await warningSchema.findOneAndDelete({GuildID: guildId, UserID: target.id, User: userTag});

                            embed.setColor("Green")
                                .setDescription(`${userTag} uyarıları silindi. | ||${target.id}||`)
                                .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true}) })
                                .setTimestamp()

                            interaction.reply({embeds: [embed]});
                        }
                        else
                        {
                            embed.setColor("Red")
                                .setDescription(`${userTag} | ||${target.id}|| hiç uyarısı yok.`)
                                .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true}) })
                                .setTimestamp()

                            interaction.reply({embeds: [embed]});
                        }
                    });
                    break;
            }
        }
}