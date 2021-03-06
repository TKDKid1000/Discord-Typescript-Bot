import { Client } from "discord.js"
import { getAllPunishments, getPunishments, PunishmentType, savePunishments } from "../punishments"

export default function(client: Client) {
    client.on("ready", async () => {
        setInterval(() => {
            for (let serverId in getAllPunishments()) {
                let punishments = getPunishments(serverId)
                getPunishments(serverId).filter((p) => p.endDate <= Date.now()).forEach(async punishment => {
                    punishments = punishments.filter(p => p !== punishment)
                    const guild = client.guilds.cache.get(punishment.guild)
                    switch (punishment.type) {
                        case PunishmentType.BAN: {
                            try {
                                await guild.bans.remove(punishment.user, "Ban expired")
                            } catch (error) {
                                
                            }
                        }
                        case PunishmentType.MUTE: {
    
                        }
                    }
                })
                savePunishments(punishments, serverId)
            }
        }, 5000)
    })
}