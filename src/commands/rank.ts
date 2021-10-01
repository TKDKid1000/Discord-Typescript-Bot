import { SlashCommandBuilder, userMention } from "@discordjs/builders"
import { MessageEmbed } from "discord.js"
import Command, { Execution } from "../command"
import { getUser, User } from "../levels"

export default new Command(<SlashCommandBuilder>new SlashCommandBuilder().setName("rank").setDescription("Shows your level").addUserOption(option => option.setName("user").setDescription("User to get level").setRequired(false)), new Execution(async interaction => {
    var member = interaction.options.getUser("user", false)
    if (!member) member = interaction.user
    const user = getUser(member.id)
    if (user) {
        await interaction.reply({embeds: [new MessageEmbed().setTitle("Levels").setDescription(`:trophy: **${userMention(member.id)}'s Level**`).setAuthor(interaction.client.user.username).setColor("BLUE").addField("Level", String(user.level), true).addField("Experience", String(user.xp), true)], components: []})
    } else {
        await interaction.reply({embeds: [new MessageEmbed().setTitle("Levels").setDescription(`:trophy: ${userMention(member.id)} has not sent a message yet.`).setAuthor(interaction.client.user.username).setColor("BLUE")], components: []})
    }
}))