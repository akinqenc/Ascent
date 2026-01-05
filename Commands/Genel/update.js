const {SlashCommandBuilder, PermissionFlagsBits, ActivityType, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("update")
        .setDescription("Botun çevrimiçi durumunu güncelle")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => 
            subcommand.setName("activity")
                .setDescription("Botun aktivitesini güncelle.")
                .addStringOption(option =>
                    option.setName("tip")
                        .setDescription("Bir aktivite seç.")
                        .setRequired(true)
                        .addChoices(
                            {name: "Oynuyor", value: "Oynuyor"},
                            {name: "Yayında", value: "Yayında"},
                            {name: "Dinliyor", value: "Dinliyor"},
                            {name: "İzliyor", value: "İzliyor"},
                        )
                )
                .addStringOption(option =>
                    option.setName("aktivite")
                        .setDescription("Mevcut aktiviteni ayarla")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName("status")
                .setDescription("Botun durumunu güncelle.")
                .addStringOption(option =>
                    option.setName("tip")
                        .setDescription("Bir durum seç.")
                        .setRequired(true)
                        .addChoices(
                            {name: "Çevrimiçi", value: "online"},
                            {name: "Boşta", value: "idle"},
                            {name: "Rahatsız Etmeyin", value: "dnd"},
                            {name: "Çevrimdışı", value: "invisible"},
                        )
                )
        ),
        async execute(interaction, client)
        {
            const {options} = interaction;

            const sub = options.getSubcommand(["activity", "status"]);
            const type = options.getString("tip");
            const activity = options.getString("aktivite");

            try
            {
                switch (sub)
                {
                    case "activity":
                        switch(type)
                        {
                            case "Oynuyor":
                                client.user.setActivity(activity, {type: ActivityType.Playing});
                                break;
                            case "Yayında":
                                client.user.setActivity(activity, {type: ActivityType.Streaming});
                                break;
                            case "Dinliyor":
                                client.user.setActivity(activity, {type: ActivityType.Listening});
                                break;
                            case "İzliyor":
                                client.user.setActivity(activity, {type: ActivityType.Watching});
                                break;
                        }

                    case "status":
                        client.user.setPresence({status: type});
                        break;
                }
            }
            catch (err)
            {
                console.log(err);
            }

            const embed = new EmbedBuilder();

            return interaction.reply({embeds: [embed.setDescription(`Başarılı bir şekilde botun aktivitesi güncellenmiştir.`)]});
        }
}