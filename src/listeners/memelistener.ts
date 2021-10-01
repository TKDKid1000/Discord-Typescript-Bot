import { Client, GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed, Snowflake } from "discord.js"
import config from "../config"
import fs from "fs"

export default function(client: Client) {

    client.on("interactionCreate", async interaction => {
        if (interaction.isButton()) {
            if (interaction.customId == "Meme.delete") {
                await interaction.reply({embeds: [new MessageEmbed().setTitle("Meme").setDescription(`:rofl: Deleted meme`).setAuthor(interaction.client.user.username).setColor("BLUE")], ephemeral: true})
                const message = <Message>interaction.message
                await message.delete()
            }
        }
    })
}