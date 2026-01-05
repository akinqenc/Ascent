const tempRoleSchema = require("../Models/Role");

async function scheduleRoleAdd(client, userId, roleId, guildId, expiresAt)
{
    const timeRemaining = expiresAt.getTime() - Date.now();

    setTimeout(async () => {
        const guild = await client.guilds.cache.get(guildId);
        const member = await guild.members.fetch(userId);

        if(member)
        {
            await member.roles.add(roleId, "Geçici rol kaldırma süresi doldu")
        }

        await tempRoleSchema.findOneAndDelete({
            guildId: guildId,
            userId: userId,
            roleId: roleId,
        });
    }, timeRemaining)
}

module.exports = scheduleRoleAdd;