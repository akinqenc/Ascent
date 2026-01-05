const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const Parser = require('rss-parser');
const parser = new Parser();

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('youtube-video-search')
    .setDescription('Bir Youtube kanalında video arama')
    .addStringOption(option => 
        option.setName('channel-id')
        .setDescription("Youtube kanalının kanal ID'si")
        .setRequired(true)
    )
    .addStringOption(option => 
        option.setName('query')
        .setDescription("Aranacak anahtar kelime")
        .setRequired(true)
    ),

    async execute(interaction)
    {
        const {options} = interaction;
        const query = options.getString('query').toLowerCase();
        const channelID = options.getString('channel-id');

        let data = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelID}`);
        let {author} = data.items[0];

        let links = [];
        let titles = [];
        await data.items.forEach(async value => 
            {
                const title = value.title.toLowerCase();

                if(title.includes(query))
                {
                    links.push(value.link);
                    titles.push(value.title);
                }
                else return;
            });

            if(links.length === 0 || titles.length === 0)
            {
                return await interaction.reply({content: `${author} kanalında ${query} anahtar sözcüğü ile eşleşen hiçbir video **bulunamadı**`, ephemeral: true});
            }

            try
            {
                await interaction.reply({content: `**Video Bulundu** \`${query}\` \n \n\`\`\`${titles.join(' \n \n \n')}\`\`\` \n \n> ${links.join(' , ')} \n \n`, ephemeral: true});
            } catch(e) {
                return await interaction.reply({content: `**${query}** anahtar kelimesiyle **ÇOK FAZLA** video eşleşti. Bu yüzden hepsini birden sana gönderemiyorum`, ephemeral: true});
            }
    }
}