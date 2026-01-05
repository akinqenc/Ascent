const {SlashCommandBuilder, EmbedBuilder, Embed, PermissionFlagsBits, Client, AttachmentBuilder} = require("discord.js");
const Levels = require("discord.js-leveling");
const Canvacord = require("canvacord");
const { profileImage } = require("discord-arts");

module.exports = {
data: new SlashCommandBuilder()
  .setName("rank")
  .setDescription("Get info about someones rank")
  .addUserOption((option) =>
    option.setName("user").setDescription("Select a user")
    .setRequired(true)
  ),
  async execute(interaction, client) {
    const { options, guildId, user } = interaction;

    const member = options.getMember("user") || user;

    
    await interaction.deferReply()

    const levelUser = await Levels.fetch(member.id, guildId);

    const embed = new EmbedBuilder();

    if (!levelUser)
      return interaction.followUp({
        content: "Görünüşe göre bu üye hiç xp kazanmamış",
        ephemeral: true,
      });
      
    var xpRequired = Levels.xpFor(levelUser.level+1);

    const rawLeaderboard = await Levels.fetchLeaderboard(guildId, 10);
    const leaderboard = await Levels.computeLeaderboard(
      client,
      rawLeaderboard,
      true
    );
    const buffer = await profileImage(member.id, {
      borderColor: ['#000000', '#ffffff'],
      badgesFrame: true,
      usernameColor: '#d40d2e',
      
      customBackground: 'https://t4.ftcdn.net/jpg/02/18/18/51/360_F_218185178_KQoxLm3r6pr56QnrUBpi7HAYIUv3Y32i.jpg',
      squareAvatar: true,
        rankData: {
            currentXp: levelUser.xp,
            requiredXp: xpRequired,
            level: levelUser.level,
            barColor: "#0aa7f0",
        }
    })
    const Img = new AttachmentBuilder(buffer, { name: 'rank.png' })

    return interaction.followUp({ files: [Img] });
  }
};
