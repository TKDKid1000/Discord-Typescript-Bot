import { GuildMember, MessageEmbed } from "discord.js"
import { SlashCommandBuilder } from "@discordjs/builders"
import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, StreamType } from "@discordjs/voice"
import ytdl from "ytdl-core"
import fs from "fs"
import path from "path"
import Command, { Execution } from "../command"
import ytsr from "youtube-sr"
import config from "../config"

var playlist: Map<string, AudioResource[]> = new Map<string, AudioResource[]>()
export {playlist}

export default new Command(<SlashCommandBuilder>new SlashCommandBuilder().setName("play").setDescription("Plays a song").addStringOption(option => option.setName("song").setDescription("YouTube search query or url").setRequired(true)), new Execution(async interaction => {
    var guild = interaction.guild
    if (!playlist.has(guild.id)) playlist.set(guild.id, new Array<AudioResource>())
    var member = <GuildMember>interaction.member
    var channel = member.voice.channel
    if (channel) {
        var audioResources: AudioResource[] = playlist.get(guild.id)
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false
        })
        const search = interaction.options.getString("song").trim()
        await interaction.reply({embeds: [new MessageEmbed().setTitle("Music").setDescription(`:musical_note: Searching for **${search}** on YouTube`).setAuthor(interaction.client.user.username).setColor("BLUE")]})
        const results = await ytsr.search(search, {type: "video", limit: 1})
        if (results.length >= 1) {
            const video = results[0]
            const stream = ytdl(<string>video.url, { filter: "audioonly" })
            const newResource = createAudioResource(stream, { inputType: StreamType.Arbitrary, metadata: {
                title: video.title,
                url: video.url
            }})
            audioResources.push(newResource)
            playlist.set(guild.id, audioResources)
            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                    maxMissedFrames: 5000
                }
            })
            
            if (audioResources.length > 1) {
                await interaction.editReply({embeds: [new MessageEmbed().setTitle("Music").setDescription(`:musical_note: Added song **${newResource.metadata["title"]}** to queue`).setAuthor(interaction.client.user.username).setColor("BLUE")]})
                return
            }
            const resource = audioResources[0]
            playlist.set(guild.id, audioResources)
            console.log(resource.started)
            console.log(resource.playbackDuration)
            player.play(resource)
            connection.subscribe(player)
            player.on(AudioPlayerStatus.Idle, async () => {
                if (player.state.status === AudioPlayerStatus.Idle) {
                        audioResources.shift()
                        if (audioResources.length >= 1) {
                            const resource = audioResources[0]
                            resource.started = false
                            console.log(resource.started)
                            console.log(resource.playbackDuration)
                            player.play(resource)
                            playlist.set(guild.id, audioResources)
                            await interaction.followUp({embeds: [new MessageEmbed().setTitle("Music").setDescription(`:musical_note: Now playing **${resource.metadata["title"]}**`).setAuthor(interaction.client.user.username).setColor("BLUE")]})
                        } else {
                            try {
                                connection.destroy()
                            } catch (err) {console.error}
                            await interaction.followUp({embeds: [new MessageEmbed().setTitle("Music").setDescription(`:musical_note: Finished playing playlist`).setAuthor(interaction.client.user.username).setColor("BLUE")]})
                        }
                    }
            })
            player.on(AudioPlayerStatus.Playing, async () => {
                await interaction.editReply({embeds: [new MessageEmbed().setTitle("Music").setDescription(`:musical_note: Now playing **${resource.metadata["title"]}**`).setAuthor(interaction.client.user.username).setColor("BLUE")]})
            })
            await interaction.editReply({embeds: [new MessageEmbed().setTitle("Music").setDescription(`:musical_note: Loading song **${resource.metadata["title"]}**...`).setAuthor(interaction.client.user.username).setColor("BLUE")]})
    
            player.on("error", error => {
                console.error(`Error: ${error.message} with resource`)
                console.log(error.resource)
            })
            
        } else {
            await interaction.editReply({embeds: [new MessageEmbed().setTitle("Music").setDescription(`:musical_note: Your search query did not return any videos`).setAuthor(interaction.client.user.username).setColor("BLUE")]})
        }
    } else {
        await interaction.reply({embeds: [new MessageEmbed().setTitle("Music").setDescription(`:musical_note: Please join a voice channel so I can play music`).setAuthor(interaction.client.user.username).setColor("BLUE")], ephemeral: true})
    }
}))