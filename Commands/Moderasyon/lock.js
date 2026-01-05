const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const LockSchema = require("../../Models/Lock");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Bir kanalı kilitle")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(option => 
        option.setName("time")
        .setDescription("Belirli bir zamana kadar kilitle: (1m, 1h, 1d)")
        .setRequired(false)
    )
    .addStringOption(option => 
        option.setName("reason")
        .setDescription("Kilitlemenin nedenini belirt")
        .setRequired(false)
    ),
    
    async execute(interaction, client)
    {
        const {guild, channel, options} = interaction;

        const reason = options.getString("reason") || "(Neden belirtilmemiş)";
        const time = options.getString("time") || "(Zaman belirtilmemiş)";

        const embed = new EmbedBuilder()
        
        if(!channel.permissionsFor(guild.id).has("SendMessages"))
            return interaction.reply({embeds: [embed.setColor("Red").setDescription("Bu kanal zaten kilitli.")], ephemeral: true});

        channel.permissionOverwrites.edit(guild.id, {
            SendMessages: false,
        })

        interaction.reply({embeds: [embed.setColor("Red").setDescription(`Bu kanal (${reason}) nedeniyle kilitli: ${time}`)] });
        const Time = options.getString("time");
        if(Time)
        {
            const ExpireDate = Date.now() + ms(Time);
            LockSchema.create({
                GuildID: guild.id,
                ChannelID: channel.id,
                Time: ExpireDate,
            });

            setTimeout(async() => {
                channel.permissionOverwrites.edit(guild.id, {
                    SendMessages: null,
                });
                interaction.editReply({embeds: [embed.setColor("Green").setDescription(`Bu kanala (${reason}) nedeniyle (${time}) olan kilitleme işlemi kaldırıldı.`)]})
                .catch(() => {});

                await LockSchema.deleteOne({ChannelID: channel.id})
            }, ms(Time))
        }
    }
}