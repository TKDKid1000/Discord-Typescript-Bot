import { userMention } from "@discordjs/builders"
import { Client, MessageEmbed, TextChannel } from "discord.js"
import config from "../config"
import { getUser, saveUser } from "../levels"
import { randomInt } from "../utils"

export default function(client: Client) {
    client.on("messageCreate", async message => {
        const channel = message.channel
        const author = message.author
        if (author.bot) return
        const user = getUser(author.id, message.guildId)
        if (user) {
            const xp = randomInt(config["levels"]["random"][0], config["levels"]["random"][1])
            user.xp += xp
            if (user.xp >= config["levels"]["xp"]) {
                user.xp = 0
                user.level += 1
                await channel.send({embeds: [new MessageEmbed().setTitle("Levels").setDescription(`:trophy: ${String(config["messages"]["levelup"]).replace("@user", userMention(user.id))}`).setAuthor(client.user.username).setColor("BLUE").addField("Level", String(user.level), true)], components: []})
            }
            saveUser(user, message.guildId)
        } else {
            saveUser({id: author.id, level: 1, xp: 1}, message.guildId)
        }
    })
}