const {EmbedBuilder} = require("@discordjs/builders");
const {GuildMember, Embed, AttachmentBuilder} = require("discord.js");
const Schema = require("../../Models/Welcome");
const { profileImage } = require('discord-arts');

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        Schema.findOne({Guild: member.guild.id}, async (err, data) => {
            if(!data) return;
            let channel = data.Channel;
            let Msg = data.Msg || " ";
            let Role = data.Role;

            const profileBuffer = await profileImage(member.id);
            const imageAttachment = new AttachmentBuilder(profileBuffer, { name: 'profile.png' });

            const {user, guild} = member;
            const welcomeChannel = member.guild.channels.cache.get(data.Channel);

            const welcomeEmbed = new EmbedBuilder()
            .setTitle("**Yeni Üye**")
            .setDescription(Msg)
            .setColor(0x037821)
            .setImage("attachment://profile.png")
            .addFields({name: 'Toplam Üye', value: `${guild.memberCount}`, inline: true})
            .setTimestamp();

            welcomeChannel.send({embeds:[welcomeEmbed], files: [imageAttachment]});
            member.roles.add(Role);
        })
    }
}