const {EmbedBuilder} = require("@discordjs/builders");
const {GuildMember, Embed, AttachmentBuilder} = require("discord.js");
const Schema = require("../../Models/Leave");
const { profileImage } = require('discord-arts');

module.exports = {
    name: "guildMemberRemove",
    async execute(member) {
        Schema.findOne({Guild: member.guild.id}, async (err, data) => {
            if(!data) return;
            let channel = data.Channel;
            let Msg = data.Msg || " ";

            const {user, guild} = member;
            const leaveChannel = member.guild.channels.cache.get(data.Channel);
            const profileBuffer = await profileImage(member.id);
            const imageAttachment = new AttachmentBuilder(profileBuffer, { name: 'profile.png' });

            const leaveEmbed = new EmbedBuilder()
            .setTitle("**Üzgünüz**")
            .setDescription(Msg)
            .setColor(0x037821)
            .setImage("attachment://profile.png")
            .addFields({name: 'Toplam Üye', value: `${guild.memberCount}`})
            .setTimestamp();

            leaveChannel.send({embeds:[leaveEmbed], files: [imageAttachment]});
        })
    }
}