const { ActivityType, Events } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const config = require("../config.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute: async (client) => {
        const rest = new REST({ version: "10" }).setToken(client.token);
        const activities = [
            `created by TERMINATOR`,
            `Phoenix - Reborn`
        ];
        let nowActivity = 0;
        const botPresence = () => {
            client.user.presence.set({
                activities: [{ name: `${activities[nowActivity++ % activities.length]}`, type: ActivityType.Listening }],
            });
            setTimeout(botPresence, 30000);
        }
        botPresence();
        client.log(`${client.user.username} ready`);
        try {
            await rest.put(
                Routes.applicationCommands(config.clientID),
                { body: client.slashDatas },
            );
        } catch (error) {
            console.error(error);
        }
    },
};
