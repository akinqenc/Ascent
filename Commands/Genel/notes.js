const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require("discord.js");
const userTaskSchema = require('../../Models/userTaskSchema');
const serverTaskSchema = require('../../Models/serverTaskSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notepad')
        .setDescription('📒 | Not Defteri')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('add')
                .setDescription('📒 Yeni not ekle')
                .addStringOption((options) =>
                    options
                        .setName('type')
                        .setDescription('Kendin için mi yoksa sunucu için mi bir not eklemek istersin?')
                        .setRequired(true)
                        .setChoices(
                            { name: 'user', value: 'u' },
                            { name: 'server', value: 's' }
                        ))
                .addStringOption((options) =>
                    options
                        .setName('new-note')
                        .setDescription('Ekleyeceğin yeni not')
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('remove')
                .setDescription('Notu kaldır')
                .addStringOption((options) =>
                    options
                        .setName('type')
                        .setDescription('Kullanıcı/Sunucu')
                        .setRequired(true)
                        .setChoices(
                            { name: 'user', value: 'u' },
                            { name: 'server', value: 's' }
                        ))
                .addNumberOption((options) =>
                    options
                        .setName('note-id')
                        .setDescription("Not ID'si")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('list')
                .setDescription('Notlarını göster')
                .addStringOption((options) =>
                    options
                        .setName('type')
                        .setDescription('Kullanıcı/Sunucu')
                        .setRequired(true)
                        .setChoices(
                            { name: 'user', value: 'u' },
                            { name: 'server', value: 's' }
                        ))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('removeall')
                .setDescription('Tüm Notlarını kaldır')
                .addStringOption((options) =>
                    options
                        .setName('type')
                        .setDescription('Kullanıcı/Sunucu')
                        .setRequired(true)
                        .setChoices(
                            { name: 'user', value: 'u' },
                            { name: 'server', value: 's' }
                        ))
        ),
    async execute(interaction) {
        const { options, user, guildId } = interaction;

        const subcommand = options.getSubcommand();
        const type = options.getString('type')
        const newTask = options.getString('new-note');
        const taskId = options.getNumber('note-id');

        const taskObject = {
            description: newTask,
        }

        try {
            if (type == 'u') {
                if (subcommand == 'add') {
                    userTaskSchema.findOne({ userId: user.id }, async (err, data) => {
                        if (err) throw err;
                        if (!data) {
                            await userTaskSchema.create({
                                userId: user.id,
                                task: [taskObject]
                            })
                            const embed = new EmbedBuilder()
                                .setTitle('📒 | Yeni Not')
                                .setDescription(`✅ | Listene yeni bir not eklendi: \`${newTask}\`\nListede \`1\` notun var`)
                                .setColor('Green');
                            interaction.reply({ embeds: [embed], ephemeral: true });
                        } else if (data) {
                            await data.task.push(taskObject) && await data.save();
                            const embed = new EmbedBuilder()
                                .setTitle('📒 | Yeni Not')
                                .setDescription(`✅ | Listene yeni bir not eklendi: \`${newTask}\`\'Listede \`${data.task.length}\` notun oldu`)
                                .setColor('Green');
                            interaction.reply({ embeds: [embed], ephemeral: true });
                        }
                    })
                } else if (subcommand == 'remove') {
                    userTaskSchema.findOne({ userId: user.id }, async (err, data) => {
                        if (err) throw err;
                        if (!data) {
                            const embed = new EmbedBuilder()
                                .setDescription('❌ | Veri bulunamadı')
                                .setColor('DarkRed');
                            interaction.reply({ embeds: [embed], ephemeral: true });
                        } else if (data) {
                            data.task.splice(taskId - 1, 1)
                            const embed = new EmbedBuilder()
                                .setDescription(`🗑️ | Başarılı bir şekilde ${taskId} notu listeden silindi`)
                                .setColor('Grey');
                            interaction.reply({ embeds: [embed], ephemeral: true });
                            data.save()
                        }
                    })
                } else if (subcommand == 'removeall') {
                    userTaskSchema.findOneAndDelete({ userId: user.id }, async (err, data) => {
                        if (err) throw err;
                        if (!data) {
                            const embed = new EmbedBuilder()
                                .setDescription('❌ | Veri bulunamadı')
                                .setColor('DarkRed');
                            interaction.reply({ embeds: [embed], ephemeral: true });
                        } else if (data) {
                            const embed = new EmbedBuilder()
                                .setDescription('🗑️ | Tüm notlar listeden silindi')
                                .setColor('Grey');
                            interaction.reply({ embeds: [embed], ephemeral: true });
                        }
                    })
                } else if (subcommand == 'list') {
                    userTaskSchema.findOne({ userId: user.id }, async (err, data) => {
                        if (err) throw err;
                        if (!data) {
                            const embed = new EmbedBuilder()
                                .setDescription('❌ | Veri bulunamadı')
                                .setColor('DarkRed');
                            interaction.reply({ embeds: [embed], ephemeral: true });
                        } else if (data) {
                            const embed = new EmbedBuilder()
                                .setTitle('📒 | Not Defteri')
                                .setDescription(`${user} Notların:\n${data.task.map((w, i) => `Id: \`${i + 1}\` Not: \`${w.description}\``).join("\n")}`)
                                .setColor('Yellow')
                            interaction.reply({ embeds: [embed], ephemeral: true });
                        }
                    })
                }
            } else if (type == 's') {
                if (interaction.guildId == null) return interaction.reply({ content: `❌ | Bu komut sadece sunucu için`, ephemeral: true })
                if (subcommand == 'add') {
                    serverTaskSchema.findOne({ guildId: guildId }, async (err, data) => {
                        if (err) throw err;
                        if (!data) {
                            await serverTaskSchema.create({
                                guildId: guildId,
                                task: [taskObject]
                            })
                            const embed = new EmbedBuilder()
                                .setTitle('Yeni Not')
                                .setDescription(`✅ | Sunucu Listesine yeni bir not eklendi: \`${newTask}\`\nListede \`1\` not var`)
                                .setColor('Green');
                            interaction.reply({ embeds: [embed], ephemeral: false });
                        } else if (data) {
                            await data.task.push(taskObject) && await data.save();
                            const embed = new EmbedBuilder()
                                .setTitle('Add Task')
                                .setDescription(`✅ | SunucuListesine yeni bir not eklendi: \`${newTask}\`\nListede \`${data.task.length}\` not oldu`)
                                .setColor('Green');
                            interaction.reply({ embeds: [embed], ephemeral: false });
                        }
                    })
                } else if (subcommand == 'remove') {
                    serverTaskSchema.findOne({ guildId: guildId }, async (err, data) => {
                        if (err) throw err;
                        if (!data) {
                            const embed = new EmbedBuilder()
                                .setDescription('❌ | Veri bulunamadı')
                                .setColor('DarkRed');
                            interaction.reply({ embeds: [embed], ephemeral: true })
                        } else if (data) {
                            data.task.splice(taskId - 1, 1)
                            const embed = new EmbedBuilder()
                                .setDescription(`🗑️ | Başarılı bir şekilde ${taskId} notu, sunucu listesinden silindi`)
                                .setColor('Grey');
                            interaction.reply({ embeds: [embed], ephemeral: true })
                            data.save()
                        }
                    })
                } else if (subcommand == 'removeall') {
                    serverTaskSchema.findOneAndDelete({ guildId: guildId }, async (err, data) => {
                        if (err) throw err;
                        if (!data) {
                            const embed = new EmbedBuilder()
                                .setDescription('❌ | Veri bulunamadı')
                                .setColor('DarkRed');
                            interaction.reply({ embeds: [embed], ephemeral: true })
                        } else if (data) {
                            const embed = new EmbedBuilder()
                                .setDescription('🗑️ | Tüm notlar, sunucu listesinden silindi')
                                .setColor('Grey');
                            interaction.reply({ embeds: [embed], ephemeral: true })
                        }
                    })
                } else if (subcommand == 'list') {
                    serverTaskSchema.findOne({ guildId: guildId }, async (err, data) => {
                        if (err) throw err;
                        if (!data) {
                            const embed = new EmbedBuilder()
                                .setDescription('❌ | Veri bulunamadı')
                                .setColor('DarkRed');
                            interaction.reply({ embeds: [embed], ephemeral: false });
                        } else if (data) {
                            const embed = new EmbedBuilder()
                                .setTitle('📒 | Not Defteri (Sunucu)')
                                .setDescription(`Merhaba ${user}, işte sunucu not defterindeki notlar: \n \n ${data.task.map((w, i) => `Id: \`${i + 1}\` Not: \`${w.description}\``).join("\n")} `)
                                .setColor('Yellow');
                            interaction.reply({ embeds: [embed], ephemeral: false });
                        }
                    })
                }
            }
        } catch (err) {
            const embed = new EmbedBuilder()
                .setDescription(err)
                .setColor('RANDOM');
            interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}
