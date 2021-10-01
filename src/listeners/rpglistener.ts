import { userMention } from "@discordjs/builders"
import { Client, Message, MessageEmbed, TextChannel } from "discord.js"
import config from "../config"
import { battleSessions, ShieldStatus } from "../rpg/battle"
import { getRpgPlayer, Material, saveRpgPlayer } from "../rpg/rpg"
import { randomInt, sleep } from "../utils"

export default function(client: Client) {
    client.on("interactionCreate", async interaction => {
        if (interaction.isButton()) {
            if (interaction.customId.startsWith("RPG.")) {
                if (interaction.customId.startsWith("RPG.Battle.")) {
                    var session = battleSessions.find(session => session.message === interaction.message.id)
                    if (session) {
                        var sessionIndex = battleSessions.findIndex(session => session.message === interaction.message.id)
                        const player = getRpgPlayer(session.owner)
                        const message = <Message>interaction.message
                        var embed = message.embeds[0]
                        var description = ""
                        const damage = randomInt((player.inv.currentWeapon ? player.inv.currentWeapon.damage : {low: 1, high: 5}).low, (player.inv.currentWeapon ? player.inv.currentWeapon.damage : {low: 1, high: 5}).high)
                        var shieldStatus: ShieldStatus = ShieldStatus.NONE
                        switch (interaction.customId) {
                            case "RPG.Battle.attack":
                                description+=`You attacked! You dealt ${damage} damage.\n`
                                session.enemy.health-=damage
                                break
                            case "RPG.Battle.shield":
                                if (randomInt(0, 20) > 15) {
                                    shieldStatus = ShieldStatus.SUCCESS
                                    if (randomInt(0, 20) > 19) {
                                        shieldStatus = ShieldStatus.PARRY
                                    }
                                } else {
                                    shieldStatus = ShieldStatus.FAIL
                                }
                                break
                            case "RPG.Battle.heal":
                                if (player.inv.materials.find(material => material.type === Material.apple && material.count > 0)) {
                                    const index = player.inv.materials.findIndex(material => material.type === Material.apple && material.count > 0)
                                    player.inv.materials[index].count-=1
                                    player.health+=10
                                    description+=`Consumed 1 apple and gained 10 health.\n`
                                } else {
                                    description+=`You don't have any apples!\n`
                                }
                                break
                        }
                        const enemyDamage = randomInt((session.enemy.weapon ? session.enemy.weapon.damage : {low: 1, high: 5}).low, (session.enemy.weapon ? session.enemy.weapon.damage : {low: 1, high: 5}).high)
                        switch (shieldStatus) {
                            case ShieldStatus.FAIL:
                                description+=`Your shield failed! ${enemyDamage} damage.\n`
                                player.health-=enemyDamage
                                break
                            case ShieldStatus.SUCCESS:
                                description+=`:video_game: Your shield blocked the attack!\n`
                                break
                            case ShieldStatus.PARRY:
                                description+=`:video_game: Your shield parried the attack!\n`
                                session.enemy.health-=(enemyDamage/2)
                                break
                            case ShieldStatus.NONE:
                                description+=`:video_game: Enemy attacks! ${enemyDamage} damage.\n`
                                player.health-=enemyDamage
                                break
                        }
                        embed.setDescription(description)
                        embed.setFields()
                        embed.addField("Your Health", String(getRpgPlayer(session.owner).health), true)
                        embed.addField("Enemy Health", String(session.enemy.health), true)
                        battleSessions[sessionIndex] = session
                        message.edit({embeds: [embed]})
                        saveRpgPlayer(player)
                    } else {
                        
                    }
                    interaction.deferUpdate()
                }
            }
        }
    })
}