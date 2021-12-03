import { Client, GuildMember, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js"
import config from "../config"
import fs from "fs"

export default function(client: Client) {
    client.on("interactionCreate", async interaction => {
        if (interaction.isButton()) {
            if (interaction.customId === "Rules.Accept") {
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