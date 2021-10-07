import { Client, GuildMember, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js"
import config from "../config"
import fs from "fs"

export default function(client: Client) {
    client.on("ready", async () => {
        client.guilds.cache.forEach(async (guild) => {
            const channel = <TextChannel>guild.channels.cache.find(channel => channel.name === config["channels"]["rules"])
            if (channel) {
                const sent = (await channel.messages.fetch({limit: 1})).first().author.id === client.user.id
                if (sent) (await channel.messages.fetch({limit: 1})).first().delete()
                const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId("rulesbutton")
                    .setStyle("SUCCESS")
                    .setLabel("Accept Rules")
                )
                const embed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle("Rules")
                .setDescription(fs.readFileSync("./rules.txt").toString())
                await channel.send({embeds: [embed], components: [row]})
            }
        })
    })

    client.on("interactionCreate", async interaction => {
        if (interaction.isButton()) {
            if (interaction.customId === "rulesbutton") {
                const guild = interaction.guild
                const role = guild.roles.cache.find(role => role.name === config["roles"]["default"])
                const member = <GuildMember>interaction.member
                if (role) {
                    try {
                        await member.roles.add(role)
                        await interaction.reply({embeds: [new MessageEmbed().setTitle("Rules").setDescription(`:notebook_with_decorative_cover: Successfully verified. You now have full access!`).setAuthor(interaction.client.user.username).setColor("BLUE")], ephemeral: true})
                    } catch (error) {
                        console.log(`Missing permisson to add role ${role.name}`)
                    }
                }
            }
        }
    })
}