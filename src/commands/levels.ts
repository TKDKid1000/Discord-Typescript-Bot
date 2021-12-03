import { SlashCommandBuilder, userMention } from "@discordjs/builders"
import { MessageEmbed } from "discord.js"
import Command, { Execution } from "../command"
import config from "../config"
import { getUsers } from "../levels"

export default new Command(new SlashCommandBuilder().setName("levels").setDescription("Shows global level top"), new Execution(async interaction => {
    const users = getUsers(interaction.guildId)
    const leaderboard = users.sort((a, b) => a.level*config["levels"]["xp"]+a.xp - b.level*config["levels"]["xp"]+b.xp).reverse().slice(0, 5)
    var leaderboardString: string[] = new Array<string>()
    leaderboard.forEach((leaderboardUser, index) => {
        leaderboardString.push(`#${index+1} ${userMention(leaderboardUser.id)}\n**Level ${leaderboardUser.level}**\n**Experience ${leaderboardUser.xp}**`)
    })

    await interaction.reply({embeds: [new MessageEmbed().setTitle("Levels").setDescription(leaderboardString.join("\n")).setAuthor(interaction.client.user.username).setColor("BLUE")], components: []})
}))