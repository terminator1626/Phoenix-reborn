const { ActivityType, Events, ButtonBuilder, ButtonStyle } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const config = require("../config.js");
const fs = require("fs");
const path = require('path');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute: async (client) => {

        const db_tickets = "C:/Users/Administrator/Desktop/terminator/impomo/db/tickets.json";
        client.db_tickets = require(db_tickets);

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

        ticketsmessage();
        setInterval(() => {
            ticketsmessage();
        }, 30000);
        async function ticketsmessage() {
            const channel = client.channels.cache.get('');
            if (!channel) return console.error("Kanál nenalezen");
            if (!client.db_tickets["message"]) {
                let ChybaREZKMessage = new EmbedBuilder()
                    .setTitle("Loading...");
                let resCh = await channel.send({ embeds: [ChybaREZKMessage] });
                client.db_tickets[`message`] = {
                    id: resCh.id
                };
                fs.writeFile(db_tickets, JSON.stringify(client.db_tickets, null, 4), async err => {
                    if (err) throw err;
                    sendEmbedREZK();
                });
            }
            let message = await channel.messages.fetch(client.db_tickets[`message`].id);
            if (!message) {
                let ChybaREZKMessage = new EmbedBuilder()
                    .setTitle("Loading...");
                let resCh = await channel.send({ embeds: [ChybaREZKMessage] });
                client.db_tickets[`message`] = {
                    id: resCh.id
                };
                fs.writeFile(db_tickets, JSON.stringify(client.db_tickets, null, 4), async err => {
                    if (err) throw err;
                    sendEmbedREZK();
                });
            }
            let rezk_embed = new EmbedBuilder()
                .setColor("Purple")
                .setTitle("Tickets")
                .setDescription(`
> Last update: <t:${Math.floor(Date.now() / 1000)}:R>

═════════════════════════════

Click button to open a ticket!
Click the button corresponding to the type of ticket you would like to open.
Phoenix Bot will send you a message with a link to a private channel and team will contact you shortly.
                `);
            //
            const partnership = new ButtonBuilder()
                .setCustomId('partnership')
                .setLabel('Partnership')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("🤝");

            const whitelist = new ButtonBuilder()
                .setCustomId('whitelist')
                .setLabel('Whitelist')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("📜");

            const support = new ButtonBuilder()
                .setCustomId('support')
                .setLabel('Support')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("📩");

            const row = new ActionRowBuilder()
                .addComponents(
                    partnership,
                    whitelist,
                    support
                );

            const response = await message.edit({
                embeds: [rezk_embed],
                components: [row],
            });
        }

    },
};
