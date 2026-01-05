const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require('discord.js');
const axios = require('axios');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('emoji-steal')
    .setDescription('Başka sunucudaki emojiyi kendi sunucuna ekler')
    .addStringOption(option =>
        option.setName('emoji').setDescription('Sunucuna eklemek istediğin emoji').setRequired(true)
    )
    .addStringOption(option =>
        option.setName('name').setDescription('Sunucuna eklemek istediğin emojinin adı').setRequired(true)
    ),

    async execute(interaction)
    {
        const {options, member} = interaction;

        if(!member.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions))
            return await interaction.reply({content: 'Bu komutu kullanmaya yetkin yok'});

        let emoji = options.getString('emoji')?.trim();
        const name = options.getString('name');

        if(emoji.startsWith("<") && emoji.endsWith(">"))
        {
            const id = emoji.match(/\d{15,}/g)[0];

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
            .then(image => {
                if(image) return "gif";
                else return "png";
            }).catch(err => {
                return "png";
            })

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }

        if(!emoji.startsWith("http"))
            return await interaction.reply({content: 'Standart discord emojilerini sunucuna ekleyemezsin'});
        
        if(!emoji.startsWith("https"))
            return await interaction.reply({content: 'Standart discord emojilerini sunucuna ekleyemezsin'});

        interaction.guild.emojis.create({attachment: `${emoji}`, name: `${name}`}).then(emoji => {
            const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`${emoji}, "**${name}**" adıyla sunucuna eklendi.`)

            return interaction.reply({embeds: [embed]});
        }).catch(err => 
            {
                interaction.reply({content: 'Daha fazla emojiyi ekleyemezsin çünkü sunucunun emoji ekleme limitine ulaştın', ephemeral: true});
            })
    }
}