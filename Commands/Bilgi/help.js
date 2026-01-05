const{
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    SelectMenuBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Tüm komutların listesini getir"),
    async execute(interaction)
    {
        const emojis = {
            bilgi: '📖',
            genel: '⚙️',
            moderasyon: '🛠',
            muzik: '🎵',
            roller: '🔥',
            seviyeler: '🏆',
            cekilis: '🎊',
            ticket: '🎫',
            oyunlar: '🎮',
            araclar: '⚒️',
        };

        await interaction.deferReply({ephemeral: true});

        const directories = [
            ...new Set(interaction.client.commands.map((cmd) => cmd.folder)),
        ];

        const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = interaction.client.commands.filter((cmd) => cmd.folder === dir).map((cmd) => {
                return {
                    name: cmd.data.name,
                    description: cmd.data.description || "Bu komut için bir açıklama yok.",
                };
            });

            return {
                directory: formatString(dir),
                commands: getCommands,
            };
        });

        const embed = new EmbedBuilder().setDescription("Bir kategori seçiniz");

        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                .setCustomId("help-menu")
                .setPlaceholder("Bir kategori seçiniz")
                .setDisabled(state)
                .addOptions(
                    categories.map((cmd) => {
                        return {
                            label: cmd.directory,
                            value: cmd.directory.toLowerCase(),
                            description: `${cmd.directory} kategorisi komutları.`,
                            emoji: emojis[cmd.directory.toLowerCase() || null],
                        };
                    })
                )
            ),
        ];

        const initialMessage = await interaction.editReply({
            embeds: [embed],
            components: components(false),
        });

        const filter = (interaction) => interaction.user.id === interaction.member.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.SelectMenu,
        });

        collector.on("collect", (interaction) => {
            const [directory] = interaction.values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const categoryEmbed = new EmbedBuilder()
            .setTitle(`${formatString(directory)}`)
            .addFields(
                category.commands.map((cmd) => {
                    return {
                        name: `\`${cmd.name}\``,
                        value: cmd.description,
                        inline: true,
                    };
                })
            );

            interaction.update({embeds: [categoryEmbed]});
        });

        collector.on("end", () => {
            initialMessage.edit({components: components(true)});
        })
    },
};