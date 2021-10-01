import { SlashCommandBuilder } from "@discordjs/builders"
import { AudioResource, getVoiceConnection, VoiceConnection } from "@discordjs/voice"
import { MessageEmbed } from "discord.js"
import Command, { Execution } from "../command"
import { playlist } from "./play"

export default new Command(<SlashCommandBuilder>new SlashCommandBuilder().setName("stop").setDescription("Stops playing a song"), new Execution(async interaction => {
    const guild = interaction.guild
    const member = guild.members.cache.get(interaction.client.user.id)
    if (member == null) return
    const connection: VoiceConnection = getVoiceConnection(guild.id)
    if (connection != null) {
        var audioResources: AudioResource[] = playlist.get(guild.id)
        audioResources.shift()
        playlist.set(guild.id, audioResources)
        connection.destroy()
        await interaction.reply({embeds: [new MessageEmbed().setTitle("Music").setDescription(`:musical_note: Stopped playing music`).setAuthor(interaction.client.user.username).setColor("BLUE")]})
    } else {
        await interaction.reply({embeds: [new MessageEmbed().setTitle("Music").setDescription(`:musical_note: I am not currently playing music`).setAuthor(interaction.client.user.username).setColor("BLUE")], ephemeral: true})
    }
}))