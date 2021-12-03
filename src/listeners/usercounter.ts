import { Client, VoiceChannel } from "discord.js"
import config from "../config"
import fs from "fs"

export default function(client: Client) {
    client.on("ready", async () => {
        setInterval(() => {
            client.guilds.cache.forEach(async (guild) => {
                const channel = guild.channels.cache.find(channel => channel.name.startsWith("Total Users: ") && channel.isVoice()) as VoiceChannel
                if (channel) {
                    await channel.setName(`Total Users: ${guild.memberCount}`)
                } else {
                    const channel = await guild.channels.create("Online Users: ", {
                        type: "GUILD_VOICE"
                    })
                    channel.permissionOverwrites.create(guild.roles.everyone, {
                        CONNECT: false
                    })
                    await channel.setName(`Total Users: ${guild.memberCount}`)
                }
            })
        }, 10000)
    })
}