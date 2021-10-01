import { SlashCommandBuilder } from "@discordjs/builders"
import { AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, StreamType } from "@discordjs/voice"
import { GuildMember, MessageEmbed } from "discord.js"
import Command, { Execution } from "../command"
import * as tts from "google-tts-api"
import https from "https"
import fs from "fs"

export default new Command(<SlashCommandBuilder>new SlashCommandBuilder().setName("tts").setDescription("Sends text to speech in voice chat").addStringOption(option => option.setName("text").setDescription("Text to speak").setRequired(true)).addBooleanOption(option => option.setName("anonymous").setDescription("Hide your name from the front").setRequired(false)), new Execution(async interaction => {
    var guild = interaction.guild
    var member = <GuildMember>interaction.member
    var channel = member.voice.channel
    if (channel) {
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false
        })
        var text = interaction.options.getString("text").trim()
        if (!interaction.options.getBoolean("anonymous")) text = interaction.member.user.username + " says. " + text
        if (text.length > 200) {
            await interaction.reply({embeds: [new MessageEmbed().setTitle("TTS").setDescription(`:speech_balloon: The specified text is over 200 characters`).setAuthor(interaction.client.user.username).setColor("BLUE").addField("Note", "Your name is added to the front of the message", true)], ephemeral: true})
            return
        }
        await interaction.reply({embeds: [new MessageEmbed().setTitle("TTS").setDescription(`:speech_balloon: Loading text **${text}**`).setAuthor(interaction.client.user.username).setColor("BLUE")], ephemeral: true})
        const url = tts.getAudioUrl(text, {
            lang: "en",
            slow: false,
            host: "https://translate.google.com"
        })
        const resource: AudioResource = createAudioResource(url, { inputType: StreamType.Arbitrary })
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
                maxMissedFrames: 5000
            }
        })
        player.play(resource)
        connection.subscribe(player)
        player.on(AudioPlayerStatus.Playing, async () => {
            await interaction.editReply({embeds: [new MessageEmbed().setTitle("TTS").setDescription(`:speech_balloon: Speaking text **${text}**`).setAuthor(interaction.client.user.username).setColor("BLUE")]})
        })
        player.on(AudioPlayerStatus.Idle, async () => {
            await interaction.editReply({embeds: [new MessageEmbed().setTitle("TTS").setDescription(`:speech_balloon: Finished speaking **${text}**`).setAuthor(interaction.client.user.username).setColor("BLUE")]})
        })
    } else {
        await interaction.reply({embeds: [new MessageEmbed().setTitle("TTS").setDescription(`:speech_balloon: You need to be in a voice channel for tts`).setAuthor(interaction.client.user.username).setColor("BLUE").addField("Note", "This works even while muted", true)], ephemeral: true})
    }
}))