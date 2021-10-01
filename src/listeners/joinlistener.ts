import { userMention } from "@discordjs/builders"
import { Client, MessageEmbed, TextChannel } from "discord.js"
import config from "../config"

export default function(client: Client) {
    client.on("guildMemberAdd", async member => {
        const guild = member.guild
        const channel = <TextChannel>guild.channels.cache.find(channel => channel.name === config["channels"]["welcome"])
        
        await channel.send({embeds: [new MessageEmbed().setTitle("Welcome").setDescription(`:wave: ${String(config["messages"]["welcome"]).replace("@user", userMention(member.id))}`).setAuthor(member.user.username).setColor("BLUE").setImage(member.user.avatarURL())]})
    })
}