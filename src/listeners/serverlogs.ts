import { channelMention, userMention } from "@discordjs/builders"
import { Client, MessageEmbed, TextChannel } from "discord.js"
import config from "../config"
import { logger } from "../logger"

export default function(client: Client) {
    client.on("guildMemberAdd", async member => {
        logger.info(`Member ${userMention(member.id)} joined ${member.guild.name}`)
    })
    client.on("guildMemberRemove", async member => {
        logger.info(`Member ${userMention(member.id)} left ${member.guild.name}`)
    })
    client.on("inviteCreate", async invite => {
        logger.info(`Invite ${invite.url} created for channel ${channelMention(invite.channel.id)}`)
    })
    client.on("inviteDelete", async invite => {
        logger.info(`Invite ${invite.url} removed from channel ${channelMention(invite.channel.id)}`)
    })
    client.on("messageUpdate", async (oldMessage, newMessage) => {
        logger.info(`${userMention(oldMessage.author.id)} edited ${oldMessage.content} to ${newMessage.content}`)
    })
    client.on("messageDelete", async (message) => {
        logger.info(`${message.author}'s message containing ${message.content} deleted`)
    })
}