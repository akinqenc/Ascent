const tempRoleSchema = require("../Models/Role");

async function scheduleRoleRemoval(client, userId, roleId, guildId, expiresAt)
{
    const timeLeft = expiresAt.getTime() - Date.now();

    setTimeout(async () => {
        const guild = client.guilds.cache.get(guildId);
        const member = await guild.members.fetch(userId);

        if(member.roles.cache.has(roleId))
        {
            try
            {
                await member.roles.remove(roleId)
                console.log(`Süresi dolmuş rol ${roleId}, ${userId} üyesinden geri alındı `)
            }
            catch (error)
            {
                console.error(`Süresi dolmuş rol geri alınırken bir sorun oluştu: ${error}`)
            }
        }

        await tempRoleSchema.deleteOne({
            guildId: guildId,
            userId: userId,
            roleId: roleId,
        });
    }, timeLeft)
}

module.exports = scheduleRoleRemoval;