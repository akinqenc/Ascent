const {PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const suggestionSchema = require("../../Models/Suggestion");

module.exports = {
    name: "interactionCreate",
    async execute(interaction)
    {
        const {member, guildId, customId, message} = interaction;

        if(!interaction.isButton()) return;

        if(customId == "suggest-accept" || customId == "suggest-decline")
        {
            if(!member.permissions.has(PermissionFlagsBits.Administrator))
                return interaction.reply({content: "Buna yetkin yok.", ephemeral: true});

            suggestionSchema.findOne({GuildID: guildId, MessageID: message.id}, async(err, data) => {
                if(err) throw err;

                if(!data)
                    return interaction.reply({content: "Veri bulunamadı.", ephemeral: true});

                const embed = message.embeds[0];

                if(!embed)
                    return interaction.reply({content: "Mesaj bulunamadı.", ephemeral: true});

                switch (customId)
                {
                    case "suggest-accept":
                        embed.data.fields[2] = {name: "Durum", value: "Onaylandı", inline: true};
                        const acceptedEmbed = EmbedBuilder.from(embed).setColor("Green");

                        message.edit({embeds: [acceptedEmbed]});
                        interaction.reply({content: "Öneri kabul edildi.", ephemeral: true})
                        break;

                    case "suggest-decline":
                        embed.data.fields[2] = {name: "Durum", value: "Reddedildi", inline: true};
                        const declined = EmbedBuilder.from(embed).setColor("Red");

                        message.edit({embeds: [declined]});
                        interaction.reply({content: "Öneri reddedildi.", ephemeral: true})
                        break;
                }
            })
        }
    }
}