const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("../../config.js");

const slash = {
    data: new SlashCommandBuilder()
        .setName("restart")
        .setDescription("Restart the bot"),
    cooldown: 5000,
    ownerOnly: true,
    async run(client, interaction) {
        try {
            await interaction.reply({ content: "Bot se restartuje", ephemeral: true });
            process.exit();
        } catch (error) {
            console.error('Error handling restart command:', error);
        }
    }
};


module.exports = { slash };
