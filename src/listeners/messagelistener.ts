import { Client, MessageEmbed, TextChannel } from "discord.js"
import {blockedWords} from "../config"
import fuzzy from "fuzzyset"

export default function(client: Client) {
    client.on("messageCreate", async message => {
        const channel = message.channel
        var words: string[] = new Array<string>()
        for (var item in blockedWords) words.push(blockedWords[item])
        const set = fuzzy(words)
        // console.log(set.get(message.content))

        // await channel.send({embeds: [new MessageEmbed().setTitle("Welcome").setDescription(`:wave: ${String(config["messages"]["welcome"]).replace("@user", `<@${member.id}>`)}`).setAuthor(member.user.username).setColor("BLUE").setImage(member.user.avatarURL())]})
    })
}