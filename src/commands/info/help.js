const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("../../config.js");

const slash = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Help you understand Phoenix Reborn"),
    cooldown: 5000,
    ownerOnly: false,
    async run(client, interaction) {
        try {
            let embed = new EmbedBuilder()
                .setColor("Blue")
                .setAuthor({ name: 'Help • Phoenix', iconURL: client.user.avatarURL() })
                .setDescription(`Idk sem si napiš nějaké info`)
                .setTimestamp()
                .setFooter({ text: '© Phoenix Reborn', iconURL: client.user.avatarURL() })

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error handling help command:', error);
        }
    }
};


module.exports = { slash };
