import { SlashCommandBuilder, time, userMention } from "@discordjs/builders"
import { MessageEmbed } from "discord.js"
import Command, { Execution } from "../command"
import ms from "ms"
import { getPunishments, PunishmentType } from "../punishments"

export default new Command(<SlashCommandBuilder>new SlashCommandBuilder().setName("ban").setDescription("Bans a user").addUserOption(option => option.setName("user").setDescription("User to ban").setRequired(true)).addStringOption(option => option.setName("reason").setDescription("Sets the reason for ban").setRequired(false)).addStringOption(option => option.setName("time").setDescription("Sets the time to ban for").setRequired(false)), new Execution(async interaction => {
    const guild = interaction.guild
    const member = interaction.guild.members.cache.get(interaction.options.getUser("user").id)
    const banTime = interaction.options.getString("time", false)
    const reason = interaction.options.getString("reason", false)
    try {
        await member.ban({reason: reason})
        if (!banTime) {
            await interaction.reply({embeds: [new MessageEmbed().setTitle("Moderation").setDescription(`:shield: ${userMention(member.id)} was permanently banned`).setAuthor(interaction.client.user.username).setColor("BLUE")], components: []})
        } else {
            var punishments = getPunishments()
            punishments.push({
                author: interaction.user.id,
                user: member.id,
                guild: guild.id,
                type: PunishmentType.BAN,
                startDate: Date.now(),
                endDate: ms(banTime)+Date.now()
            })
            await interaction.reply({embeds: [new MessageEmbed().setTitle("Moderation").setDescription(`:shield: ${userMention(member.id)} was temporarily banned until ${time(ms(banTime)+Date.now())}`).setAuthor(interaction.client.user.username).setColor("BLUE")], components: []})
        }
    } catch (error) {
        await interaction.reply({embeds: [new MessageEmbed().setTitle("Moderation").setDescription(`:shield: Insufficient permissions to ban ${userMention(member.id)}`).setAuthor(interaction.client.user.username).setColor("BLUE")], components: [], ephemeral: true})
    }
}))