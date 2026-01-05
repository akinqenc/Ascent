const {Client, GatewayIntentBits, Partials, Collection, EmbedBuilder, ButtonBuilder, Events, ActionRowBuilder,ButtonStyle} = require('discord.js');

const {Guilds, GuildMembers, GuildMessages, MessageContent, GuildMessageReactions, GuildModeration} = GatewayIntentBits;
const {User, Message, GuildMember, ThreadMember, Channel, DirectMessages} = Partials;

const {DisTube, GuildIdManager} = require("distube");
const {SpotifyPlugin} = require("@distube/spotify");

const {loadEvents} = require('./Handlers/eventHandler');
const {loadCommands} = require('./Handlers/commandHandler');

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages, 'GuildVoiceStates', MessageContent, GuildMessageReactions, GuildModeration],
    partials: [User, Message, GuildMember, ThreadMember, Channel, DirectMessages],
    allowedMentions: {
        repliedUser: false,
    },
});

client.on("ready", (client) => {
    console.log("Now Online: " + client.user.tag);
});

client.on('guildCreate', guild => {
    const defaultChannel = guild.systemChannel;
    if (defaultChannel) {
        const embed = new EmbedBuilder()
        .setColor('#e01444')
        .setTitle('Merhaba!')
        .setDescription("Beni sunucuna eklediğin için teşekkürler!\n'/' ön ekini kullanarak ile komutları çağırabilirsin.\n\nHerhangi bir kanala '/help' yazarak beni kullanmaya başlayabilirsin :)");
        defaultChannel.send({ embeds: [embed] });
    }
  });

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: false,
    emitAddSongWhenCreatingQueue:false,
    plugins: [new SpotifyPlugin()]
});

//REMINDER

const remindSchema = require('./Models/remind.js');
setInterval(async () => {
    const reminders = await remindSchema.find();
    if(!reminders) return;
    else
    {
        reminders.forEach(async reminder => {
            if(reminder.Time > Date.now()) return;

            const user = await client.users.fetch(reminder.User);

            user?.send({
                content: `${user} benden şunu hatırlatmamı istemiştin: \`${reminder.Remind}\``
            }).catch(err => {return;});

            await remindSchema.deleteMany({
                Time: reminder.Time,
                User: user.id,
                Remind: reminder.Remind
            });
        })
    }
}, 1000 * 5);

//REMINDER END

client.commands = new Collection();
client.config = require('./config.json');
client.giveawayConfig = require("./config.js");

['giveawaysEventsHandler', 'giveawaysManager'].forEach((x) => {
    require(`./Utils/${x}`)(client);
})

module.exports = client;

client.login(client.config.token).then(() => {
    loadEvents(client);
    loadCommands(client);
});


//REACTOR

const reactor = require("./Models/reactorSchema");
client.on(Events.MessageCreate, async message => {
    const data = await reactor.findOne({Guild: message.guild.id, Channel: message.channel.id});
    if(!data) return;
    else
    {
        if(message.author.bot) return;
        message.react(data.Emoji);
    }
})

client.on(Events.MessageReactionRemove, async(reaction, user) => {
    if(!reaction.message.guildId) return;
    if(user.bot) return;

    let cID = `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
    if(!reaction.emoji.id) CID = reaction.emoji.name;

    const data = await reactions.findOne({Guild: reaction.message.guildId, Message: reaction.message.id, Emoji: cID});
    if(!data) return;

    const guild = await client.guilds.cache.get(reaction.message.guildId);
    const member = await guild.members.cache.get(user.id);

    try
    {
        await member.roles.remove(data.Role);
    } catch (e) {
        return;
    }
});


//MESSAGE LINK IDENTIFIER
client.on(Events.MessageCreate, async message => {
    if(!message.guild) return;
    if(message.author.bot) return;

    if(message.content.match(/https:\/\/discord\.com\/channels\/\d+\/(\d+)\/(\d+)/))
    {
        try {
            const [, channelId, messageId] = message.content.match(/https:\/\/discord\.com\/channels\/\d+\/(\d+)\/(\d+)/);
            const directmessage = await message.channel.messages.fetch(messageId);

            const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setAuthor({name: directmessage.author.username, iconURL: directmessage.author.avatarURL()})
            .setDescription(directmessage.content)

            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Mesajı Görüntüle')
                .setStyle(ButtonStyle.Link)
                .setURL(message.content)
            );

            await message.reply({embeds: [embed], components: [button]});
        } catch (e) {
            return console.log(e);
        }
    }
    else return;
});

client.on('messageCreate', message => {
    if(message.content === "sa")
    {
        message.channel.send('as');
    }
})