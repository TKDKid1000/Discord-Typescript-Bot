import { SlashCommandBuilder } from "@discordjs/builders"
import axios from "axios"
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js"
import Command, { Execution } from "../command"

export default new Command(new SlashCommandBuilder().setName("meme").setDescription("Gets a random meme"), new Execution(async interaction => {
    await interaction.deferReply()
    const request = await axios.get("https://reddit.com/r/memes/random.json")
    const post = request.data[0].data.children[0].data
    await interaction.editReply({embeds: [new MessageEmbed().setTitle("Meme: " + post.title).setDescription(`:pencil: [u/${post.author}](https://reddit.com/u/${post.author}) :thumbsup: ${post.ups-post.downs} :speech_balloon: ${post.num_comments}`).setAuthor(interaction.client.user.username).setColor("BLUE").setURL("https://reddit.com"+post.permalink).setImage(post.url)], components: [new MessageActionRow().addComponents(new MessageButton().setCustomId("Meme.delete").setStyle("DANGER").setLabel("Remove"))]})
}))