const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require("discord.js");
const ms = require("ms");

module.exports =
{
    data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Bir üyeye zamanaşımı uygula")
    .addUserOption(option => 
        option.setName("hedef")
        .setDescription("Zamanaşımı uygulanacak üyeyi seç")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("zaman")
        .setDescription("Ne kadar zamanaşımı uygulansın?")
        .setRequired(true)
        .addChoices(
            {name: '60 Seconds', value: '60'},
            {name: '2 minutes', value: '120'},
            {name: '5 minutes', value: '300'},
            {name: '10 Minutes', value: '600'},
            {name: '15 Minutes', value: '900'},
            {name: '20 Minutes', value: '1200'},
            {name: '30 Minutes', value: '1800'},
            {name: '45 Minutes', value: '2700'},
            {name: '1 Hour', value: '3600'},
            {name: '2 Hour', value: '7200'},
            {name: '3 Hour', value: '10800'},
            {name: '5 Hour', value: '18000'},
            {name: '10 Hour', value: '36000'},
            {name: '1 Day', value: '86400'},
            {name: '2 Day', value: '172800'},
            {name: '3 Day', value: '259200'},
            {name: '5 Day', value: '432000'},
            {name: '1 Week', value: '604800'}
        )
    )
    .addStringOption(option =>
        option.setName("neden")
        .setDescription("Neden")
        .setRequired(false)
    ),

        async execute(interaction) {
            const { guild, options } = interaction;

            const user = options.getUser("hedef");
            const timeMember = guild.members.cache.get(user.id);
            const duration = options.getString("zaman");
            const reason = options.getString("neden") || "Neden belirtilmemiş";

            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
                return await interaction.reply({content: 'Bu komutu kullanmaya yetkin yok', ephemeral: true});
            if(!timeMember) return await interaction.reply({content: 'Bu kullanıcı artık bu sunucuda değil.', ephemeral: true});
            if(interaction.member.id === timeMember.id) return await interaction.reply({content: 'Kendini susturamazsın', ephemeral: true});
            if(!timeMember.kickable) return await interaction.reply({content: 'Bu üyeye zamanaşımı ugulayamam. Onun rolü yüksek', ephemeral: true});
            if(timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({content: 'Zamanaşımı komutunu adminler üzerinde kullanamazsın', ephemeral: true});

            await timeMember.timeout(duration * 1000, reason);

            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle('Zamanaşımı Uygulandı')
            .addFields({name: 'Üye', value: `> ${user.tag}`, inline: true})
            .addFields({name: 'Süre', value: `> ${duration / 60} dakika`, inline: true})
            .addFields({name: 'Neden', value: `> ${reason}`, inline: true})
            .setTimestamp()
            
            const dmembed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(`✅ ${guild.name} sunucusunda sana zamanaşımı uygulandı. Durumu görüntülemek için sunucuya bakabilirsin. | ${reason}`)
            
            await timeMember.send({embeds: [dmembed]}).catch(err =>{return;});

            await interaction.reply({embeds: [embed]});
        }
}