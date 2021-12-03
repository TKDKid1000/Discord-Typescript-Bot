import { SlashCommandBuilder } from "@discordjs/builders"
import { GuildMember, MessageEmbed, Permissions, TextChannel } from "discord.js"
import Command, { Execution } from "../command"

export default new Command(<SlashCommandBuilder>new SlashCommandBuilder().setName("delete").setDescription("Deletes messages in a channel").addIntegerOption(option => option.setName("count").setDescription("Number of messages to delete").setRequired(true)), new Execution(async interaction => {
    const member = <GuildMember>interaction.member
    const channel = <TextChannel>interaction.channel
    const messageCount = interaction.options.getInteger("count")
    if (member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
        if (messageCount >= 1) {
            try {
                await channel.bulkDelete(messageCount)
                await interaction.reply({embeds: [new MessageEmbed().setTitle("Tools").setDescription(`:tools: Successfully deleted ${messageCount} message${messageCount>1 ? "s" : ""}`).setAuthor(interaction.client.user.username).setColor("BLUE")], ephemeral: true})
            } catch (err) {
                await interaction.reply({embeds: [new MessageEmbed().setTitle("Tools").setDescription(`:tools: Failed to delete ${messageCount} message${messageCount>1 ? "s" : ""}`).setAuthor(interaction.client.user.username).setColor("BLUE")], ephemeral: true})
            }
        } else {
            await interaction.reply({embeds: [new MessageEmbed().setTitle("Tools").setDescription(`:tools: You have to delete at least 1 message`).setAuthor(interaction.client.user.username).setColor("BLUE")], ephemeral: true})
        }
    } else {
        await interaction.reply({embeds: [new MessageEmbed().setTitle("Tools").setDescription(`:tools: You do not have permission to use that command`).setAuthor(interaction.client.user.username).setColor("BLUE")], ephemeral: true})
    }
}))