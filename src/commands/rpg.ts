import { SlashCommandBuilder } from "@discordjs/builders"
import { MessageEmbed } from "discord.js"
import Command, { Execution } from "../command"
import { battleCommand } from "../rpg/battle"

export default new Command(<SlashCommandBuilder>new SlashCommandBuilder().setName("rpg").setDescription("Rpg bot commands").addSubcommand(subcommand => subcommand.setName("battle").setDescription("Battles a random enemy")), new Execution(async interaction => {
    switch (interaction.options.getSubcommand()) {
        case "battle":
            await battleCommand(interaction)
            break
        default:
            await interaction.reply({embeds: [new MessageEmbed().setTitle("RPG").setDescription(`:video_game: It appears you have provided an invalid command!`).setAuthor(interaction.client.user.username).setColor("BLUE")], components: []})
            break
    }
}))