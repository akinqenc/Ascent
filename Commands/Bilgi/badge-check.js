const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('badge-check')
    .setDescription('Girilen rozete kimlerin sahip olduğuna bak')
    .addStringOption(option =>
        option.setName('badge')
        .setDescription('Bakmak istediğin rozet')
        .addChoices(
            {name: "Staff", value: "Staff"},
            {name: "Partner", value: "Partner"},
            {name: "Certified Moderator", value: "CertifiedModerator"},
            {name: "Hypesquad", value: "Hypesquad"},
            {name: "Verified Bot", value: "VerifiedBot"},
            {name: "Early Supporter", value: "PremiumEarlySupporter"},
            {name: "Verified Bot Developer", value: "VerifiedBotDeveloper"},
            {name: "Active Developer", value: "ActiveDeveloper"},
            {name: "Bravery", value: "HypeSquadOnlineHouse1"},
            {name: "Brilliance", value: "HypeSquadOnlineHouse2"},
            {name: "Balance", value: "HypeSquadOnlineHouse3"},
        )
        .setRequired(true)
    ),

    async execute(interaction)
    {
        const {options, guild} = interaction;
        const check = options.getString('badge');

        await interaction.deferReply({ephemeral: true});

        let members = [];
        await guild.members.cache.forEach(async member => {
            if(member.user.flags.toArray().includes(check)) members.push(member);
        });

        if(members.length === 0) members.push("None");

        try
        {
            await interaction.editReply({content: `Bu sunucudaki **${check}** rozetine sahip üyeler: \n\n> ${members.join('\n> ')}`});
        }
        catch(e)
        {
            return await interaction.editReply({content: `${check} rozete sahip **çok fazla** insan var`});
        }
    }
}