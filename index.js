const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    PermissionsBitField,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Collection,
    ChannelType,
    MessageCollector,
    AttachmentBuilder,
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    REST,
    Routes
} = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember
    ],
    shards: "auto"
});
const fs = require("fs");
const path = require('path');
const moment = require("moment");
const fetch = require("isomorphic-fetch");
const config = require("./src/config.js");
let token = config.token;
client.slashCommands = new Collection();
client.slashDatas = [];
function log(message) {
    console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] • ${message}`);
};
client.log = log
client.config = config;
const commandFolders = readdirSync("./src/commands");
Promise.all(commandFolders.map(async (category) => {
    const commandFiles = await readdirSync(`./src/commands/${category}`);
    await Promise.all(commandFiles.map(async (file) => {
        const commands = await require(`./src/commands/${category}/${file}`);
        if (commands) {
            if (commands.slash) {
                const slashCommand = commands.slash;
                if (slashCommand.data.name === "test") return;
                client.slashDatas.push(slashCommand.data.toJSON());
                client.slashCommands.set(slashCommand.data.name, slashCommand);
                client.log(`Loading: ${slashCommand.data.name} • (slash)`);
            }
        }
    }));
}));
const eventFiles = readdirSync("./src/events");
Promise.all(eventFiles.map(async (file) => {
    const event = await require(`./src/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
        client.log(`Loading: ${event.name} • (event)`);
    } else {
        client.on(event.name, (...args) => event.execute(...args));
        client.log(`Loading: ${event.name} • (event)`);
    }
}));
process.on("unhandledRejection", (e) => {
    client.log(e);
});
process.on("uncaughtException", (e) => {
    client.log(e);
});
process.on("uncaughtExceptionMonitor", (e) => {
    client.log(e);
});
client.login(token);


async function createTicket(guild, username, userId, roleId, category, reason, interaction) {
    const ticketName = `ticket-${username}`;
    const pingROLE = "1239210114343501834";
    const invisibleText = `** **||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| _ _ _ _ _ _ <@${userId}>`
    client.log("Ticket Name:", ticketName);
    const newTicket = await guild.channels.create({
        name: ticketName,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: guild.roles.everyone,
                deny: [
                    PermissionsBitField.Flags.ViewChannel
                ]
            },
            {
                id: userId,
                allow: [
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ViewChannel
                ]
            },
            {
                id: roleId,
                allow: [
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ViewChannel
                ]
            }
        ],
        parent: category,
    });

    if (reason === "partnership") {
        let welcomeMessage = new EmbedBuilder()
            .setAuthor({ name: `${username}\`s ticket`, iconURL: `https://cdn.discordapp.com/icons/1167817381788262490/b1307c7333951e9a80b7631479e1efe5.png` })
            .setDescription(`
<@${userId}>, someone from <@&${pingROLE}> will assist you shortly.

But before you write anything, please invite our bot with full permissions to confirm that you meet the conditions!
              `)
            .addFields(
                {
                    name: "Reason:",
                    value: `> ${reason}`
                }
            )
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger)
            );
        await newTicket.send({
            content: invisibleText,
            embeds: [welcomeMessage],
            components: [row]
        });
    } else {
        let welcomeMessage = new EmbedBuilder()
            .setAuthor({ name: `${username}\`s ticket`, iconURL: `https://cdn.discordapp.com/icons/1167817381788262490/b1307c7333951e9a80b7631479e1efe5.png` })
            .setDescription(`<@${userId}>, someone from <@&${pingROLE}> will assist you shortly.`)
            .addFields(
                {
                    name: "Reason:",
                    value: `> ${reason}`
                }
            )
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger)
            );
        await newTicket.send({
            content: invisibleText,
            embeds: [welcomeMessage],
            components: [row]
        });
    }
    const redir = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Go to ticket')
                .setURL(`https://discord.com/channels/${guild.id}/${newTicket.id}`)
                .setStyle(ButtonStyle.Link)
        );
    await interaction.reply({
        content: `We have created a ticket on the \`${reason}\` topic. You will be contacted soon.`,
        ephemeral: true,
        components: [redir]
    });

    return newTicket;
}
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    const guild = interaction.guild;
    const categoryId = '1207691510460583986';
    const roleID = "1207801075156127794";
    if (interaction.customId === 'partnership') {
        const newTicket = await createTicket(
            guild,
            interaction.user.username,
            interaction.user.id,
            roleID,
            categoryId,
            "partnership",
            interaction
        );
    } else if (interaction.customId === 'whitelist') {
        const newTicket = await createTicket(
            guild,
            interaction.user.username,
            interaction.user.id,
            roleID,
            categoryId,
            "whitelist",
            interaction
        );
    } else if (interaction.customId === 'support') {
        const newTicket = await createTicket(
            guild,
            interaction.user.username,
            interaction.user.id,
            roleID,
            categoryId,
            "support",
            interaction
        );
    }
});