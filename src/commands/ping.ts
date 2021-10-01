import { SlashCommandBuilder } from "@discordjs/builders"
import { MessageEmbed } from "discord.js"
import Command, { Execution } from "../command"

export default new Command(new SlashCommandBuilder().setName("ping").setDescription("Shows your ping"), new Execution(async interaction => {
    await interaction.reply({embeds: [new MessageEmbed().setTitle("Ping").setDescription(`:timer: Your ping is \`${interaction.client.ws.ping}ms\``).setAuthor(interaction.client.user.username).setColor("BLUE")], components: []})
}))