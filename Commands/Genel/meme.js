const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Kendimi şanslı hissediyorum")
        .addStringOption(option =>
            option.setName("platform")
                .setDescription("Meme platformu (opsiyonel)")
                .addChoices(
                    {name: "Reddit", value: "reddit"},
                    {name: "Giphy", value: "giphy"}
                )
            ),

            async execute(interaction)
            {
                const {guild, options, member} = interaction;

                const platform = options.getString("platform");

                const embed = new EmbedBuilder()

                async function redditMeme()
                {
                    await fetch('https://www.reddit.com/r/KGBTr/random/.json').then(async res => {
                        let meme = await res.json();

                        console.log(meme);

                        let title = meme[0].data.children[0].data.title;
                        let author = meme[0].data.children[0].data.author;
                        let url = meme[0].data.children[0].data.url;

                        if (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.gif'))
                        {
                            embed.setImage(url);
                            return interaction.reply({embeds: [embed.setTitle(title).setImage(url).setURL(url).setColor("Random").setFooter({text: author})] });
                        }
                        else if (url.endsWith('.mp4') || url.endsWith('.gifv') || url.includes('v.redd.it'))
                        {
                            embed.setDescription('This post is a video. Click the link to view it.');
                            embed.setURL(url);
                            return interaction.reply({embeds: [embed.setTitle(title).setURL(url).setColor("Random").setFooter({text: author})] });
                        }
                    });
                }

                async function giphyMeme()
                {
                    await fetch('https://api.giphy.com/v1/gifs/random?api_key=GMqm3gC5bg2z3Gcih5zJW1QzmcQ7NY4y&tag=&rating=g').then(async res => {
                        let meme = await res.json();

                        let title = meme.data.title;
                        let url = meme.data.images.original.url;
                        let link = meme.data.url;
                        let author = meme.data.user.display_name;
                        let pf = meme.data.user.avatar_url;

                        return interaction.reply({
                            embeds: [embed.setTitle(`${title}`).setImage(`${url}`).setURL(link).setColor("Random").setFooter({text: author, iconURL: pf})],
                        });
                    });
                }

                if(platform === "reddit")
                {
                    redditMeme();
                }

                if(platform === "giphy")
                {
                    giphyMeme();
                }

                if(!platform)
                {
                    let memes = [giphyMeme, redditMeme];
                    memes[Math.floor(Math.random() * memes.length)]();
                }
            }
}