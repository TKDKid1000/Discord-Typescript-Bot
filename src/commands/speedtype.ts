import { SlashCommandBuilder, time } from "@discordjs/builders"
import axios from "axios"
import { Guild, GuildMember, MessageEmbed } from "discord.js"
import Command, { Execution } from "../command"
import { sleep } from "../utils"

export default new Command(new SlashCommandBuilder().setName("typecomp").setDescription("Discord version of TypeComp"), new Execution(async interaction => {
    const embed = new MessageEmbed().setTitle("TypeComp").setDescription(`:stopwatch: Ready to speedtype?`).setAuthor(interaction.client.user.username).setColor("BLUE")
    const words: string[] = (await axios.get("https://random-word-form.herokuapp.com/random/noun?count=10")).data
    await interaction.reply({embeds: [embed]})
    for (var x=3; x>0; x--) {
        await sleep(1000)
        embed.setDescription(`:stopwatch: Starting in **${x}**`)
        await interaction.editReply({embeds: [embed]})
    }
    sleep(1000)
    var word: number = 0
    var correct: number = 0
    const startTime: number = Date.now()
    const collector = interaction.channel.createMessageCollector({time: 60000, max: 10, filter: m => m.member == <GuildMember>interaction.member})
    embed.setDescription(`:stopwatch: **${words[word]}`)
    await interaction.editReply({embeds: [embed]})
    collector.on("collect", async message => {
        if (word < 10) {
            if (words[word] === message.content) correct++
            word++
            await message.delete()
            embed.setDescription(`:stopwatch: **${words[word]}`)
            await interaction.editReply({embeds: [embed]})
        }
    })
    collector.on("end", async () => {
        const endTime: number = Date.now()
        const time: number = endTime-startTime
        embed.setDescription(`:stopwatch: You took **${time}**ms and got **${correct}/${words.length}** correct`)
        interaction.editReply({embeds: [embed]})
    }) 
}))