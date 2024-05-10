const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios").default;

const slash = {
    data: new SlashCommandBuilder()
        .setName("donate")
        .setDescription("Donate to support Phoenix Reborn"),
    cooldown: 20000,
    run: async (client, interaction) => {
        const loadingEmbed = new EmbedBuilder()
            .setAuthor({
                name: "Donation Info",
                iconURL: "https://cdn.discordapp.com/emojis/1206990708486049832.png?size=96&quality=lossless"
            })
            .setColor("Green")
            .setDescription(`** **\n> **Loading...**\n** **\n** **`)
            .setFooter({
                text: "© Phoenix Reborn",
                iconURL: client.user.avatarURL()
            });
        await interaction.reply({
            embeds: [loadingEmbed],
            ephemeral : true
        });
        const menuEmbed = new EmbedBuilder()
            .setAuthor({
                name: "Donation Info",
                iconURL: "https://cdn.discordapp.com/emojis/1206990708486049832.png?size=96&quality=lossless"
            })
            .setColor("Green")
            .setDescription(`
Thank you in advance for considering donating our faucet, if you have already donated we thank you very much!

- How will we use the donation?
> - Donate outside of FaucetPay, we will exchange and send to FaucetPay and credit the balance to our faucet
> - Donate via FaucetPay and credit the balance directly to our faucet

- How long can it take for a donation to be credited to my faucet?
> - Depends on when I notice it, donate via FaucetPay does not send any notification and it can take several hours so after donating create a ticket so we can announce your donation and publicly thank you
> - If it's outside FaucetPay please create a ticket if you want to be mentioned in case you want to be anonymous you don't need to create a ticket, donate outside FaucetPay we can take several days to transfer, it depends on fees and other factors that may not allow the transaction at the moment

> **If you send a donation via litecoin we will respond similarly to a FaucetPay deposit as we use the address we have with FaucetPay**
            `)
            .setFooter({
                text: "© Phoenix Reborn",
                iconURL: client.user.avatarURL()
            });
        const lightningNetworkEmbed = new EmbedBuilder()
            .setAuthor({
                name: "Donation Info | Lightning Network",
                iconURL: "https://cdn.discordapp.com/emojis/1206990708486049832.png?size=96&quality=lossless"
            })
            .setColor("Green")
            .setDescription(`
Thank you for choosing our project and for supporting it! We really appreciate it and thank you for any donation!

Lightning Address:
\`\`\`donate@cs2resellers.com\`\`\`
            `)
            .setImage("https://quickchart.io/qr?text=quietforest231706@getalby.com&size=450")
            .setFooter({
                text: "© Phoenix Reborn",
                iconURL: client.user.avatarURL()
            });
        const faucetPayEmbed = new EmbedBuilder()
            .setAuthor({
                name: "Donation Info | FaucetPay",
                iconURL: "https://cdn.discordapp.com/emojis/1206990708486049832.png?size=96&quality=lossless"
            })
            .setColor("Green")
            .setDescription(`
Thank you for choosing our project and for supporting it! We really appreciate it and thank you for any donation!
            
FaucetPay:
- Go to: [**\` Direct Transfer \`**](https://faucetpay.io/transfer)
- Fill in the form with our username:
\`\`\`terminator1626\`\`\`
                `)
            .setFooter({
                text: "© Phoenix Reborn",
                iconURL: client.user.avatarURL()
            });
        
        const message = await interaction.editReply({
            embeds: [menuEmbed],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("menu")
                        .setLabel("Menu")
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId("lightning")
                        .setLabel("Lightning Network")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId("faucetpay")
                        .setLabel("FaucetPay")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setLabel("Web")
                        .setURL("https://cs2resellers.com/donate/")
                        .setStyle(ButtonStyle.Link)
                )
            ]
        });
        const filter = (interaction) => interaction.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({
            filter,
            time: 300000
        });
        collector.on("collect", async (interaction) => {
            switch (interaction.customId) {
                case "menu":
                    await interaction.update({
                        embeds: [menuEmbed],
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("menu")
                                    .setLabel("Menu")
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(),
                                new ButtonBuilder()
                                    .setCustomId("lightning")
                                    .setLabel("Lightning Network")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId("faucetpay")
                                    .setLabel("FaucetPay")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setLabel("Web")
                                    .setURL("https://cs2resellers.com/donate/")
                                    .setStyle(ButtonStyle.Link)
                            )
                        ]
                    });
                    break;
                case "lightning":
                    await interaction.update({
                        embeds: [lightningNetworkEmbed],
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("menu")
                                    .setLabel("Menu")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId("lightning")
                                    .setLabel("Lightning Network")
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(),
                                new ButtonBuilder()
                                    .setCustomId("faucetpay")
                                    .setLabel("FaucetPay")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setLabel("Web")
                                    .setURL("https://cs2resellers.com/donate/")
                                    .setStyle(ButtonStyle.Link)
                            )
                        ]
                    });
                    break;
                case "faucetpay":
                    await interaction.update({
                        embeds: [faucetPayEmbed],
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("menu")
                                    .setLabel("Menu")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId("lightning")
                                    .setLabel("Lightning Network")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId("faucetpay")
                                    .setLabel("FaucetPay")
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(),
                                new ButtonBuilder()
                                    .setLabel("Web")
                                    .setURL("https://cs2resellers.com/donate/")
                                    .setStyle(ButtonStyle.Link)
                            )
                        ]
                    });
                    break;
            }
        });

        collector.on("end", async () => {
            const guildCommandsForDonate = await interaction.guild.commands.fetch();
            const donateCommand = guildCommandsForDonate.find(c => c.name === "donate");
            const endedEmbed = new EmbedBuilder()
                .setAuthor({
                    name: "Donation Info",
                    iconURL: "https://cdn.discordapp.com/emojis/1206990708486049832.png?size=96&quality=lossless"
                })
                .setColor("Green")
                .setDescription(`
Thank you in advance for considering donating our faucet, if you have already donated we thank you very much!

Collector expired To get the active collector for the buttons please enter the </donate:${donateCommand.id}> command again.
                `)
                .setFooter({
                    text: "© Phoenix Reborn",
                    iconURL: client.user.avatarURL()
                });
            await interaction.editReply({
                embeds: [endedEmbed],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel("Web")
                            .setURL("https://cs2resellers.com/donate/")
                            .setStyle(ButtonStyle.Link)
                    )
                ]
            });
        });
    }
};

module.exports = { slash };
