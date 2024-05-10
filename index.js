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