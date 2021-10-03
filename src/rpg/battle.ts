import { ButtonInteraction, CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js"
import { randomInt, sleep } from "../utils"
import { defaultRpgPlayer, getRpgPlayer, Material, Player, saveRpgPlayer, Weapon, Weapons } from "./rpg"

var battleSessions: BattleSession[] = new Array<BattleSession>()

interface BattleSession {
    owner: string,
    message: string
    enemy: Enemy,
}

interface Enemy {
    level: number,
    health: number,
    weapon: Weapon
}

enum ShieldStatus {
    FAIL,
    SUCCESS,
    PARRY,
    NONE
}

async function battleCommand(interaction: CommandInteraction) {
    const player = getRpgPlayer(interaction.user.id)
    if (player) {
        if (!(battleSessions.find(session => session.owner === player.id))) {
            if (player.health > 25) {
                const buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId("RPG.Battle.attack")
                    .setStyle("PRIMARY")
                    .setLabel("Attack"),
                    new MessageButton()
                    .setCustomId("RPG.Battle.shield")
                    .setStyle("SECONDARY")
                    .setLabel("Shield"),
                    new MessageButton()
                    .setCustomId("RPG.Battle.heal")
                    .setStyle("DANGER")
                    .setLabel("Heal")
                )
                await interaction.deferReply()
                var battleSession: BattleSession = {owner: player.id, message: (await interaction.fetchReply()).id, enemy: {health: 100, level: player.level, weapon: Weapons.find(weapon => weapon.name === "katana")}}
                await interaction.editReply({embeds: [new MessageEmbed().setTitle("RPG").setDescription(`It's your turn! Click a command.`).setAuthor(interaction.client.user.username).setColor("BLUE")], components: [buttons]})
                battleSessions.push(battleSession)
            } else {
                await interaction.reply({embeds: [new MessageEmbed().setTitle("RPG").setDescription(`You cannot initiate battle under 20 health!`).setAuthor(interaction.client.user.username).setColor("BLUE")]})
            }
        } else {
            await interaction.reply({embeds: [new MessageEmbed().setTitle("RPG").setDescription(`You are already in battle!`).setAuthor(interaction.client.user.username).setColor("BLUE")], components: [], ephemeral: true})
        }
    } else {
        saveRpgPlayer(defaultRpgPlayer(interaction.user.id))
        await interaction.reply({embeds: [new MessageEmbed().setTitle("RPG").setDescription(`Created RPG profile, please run this command again.`).setAuthor(interaction.client.user.username).setColor("BLUE")], components: [], ephemeral: true})
    }
}

async function battleListener(interaction: ButtonInteraction) {
    var session = battleSessions.find(session => session.message === interaction.message.id)
    if (session) {
        var sessionIndex = battleSessions.findIndex(session => session.message === interaction.message.id)
        const player = getRpgPlayer(session.owner)
        const message = <Message>interaction.message
        var embed = message.embeds[0]
        var description = embed.description
        const damage = randomInt((player.inv.currentWeapon ? player.inv.currentWeapon.damage : {low: 1, high: 5}).low, (player.inv.currentWeapon ? player.inv.currentWeapon.damage : {low: 1, high: 5}).high)
        var shieldStatus: ShieldStatus = ShieldStatus.NONE
        switch (interaction.customId) {
            case "RPG.Battle.attack":
                description+=`\nYou attacked! You dealt ${damage} damage.`
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
                    description+=`\nConsumed 1 apple and gained 10 health.`
                } else {
                    description+=`\nYou don't have any apples!`
                }
                break
        }
        const enemyDamage = randomInt((session.enemy.weapon ? session.enemy.weapon.damage : {low: 1, high: 5}).low, (session.enemy.weapon ? session.enemy.weapon.damage : {low: 1, high: 5}).high)
        switch (shieldStatus) {
            case ShieldStatus.FAIL:
                description+=`\nYour shield failed! ${enemyDamage} damage.`
                player.health-=enemyDamage
                break
            case ShieldStatus.SUCCESS:
                description+=`\nYour shield blocked the attack!`
                break
            case ShieldStatus.PARRY:
                description+=`\nYour shield parried the attack!`
                session.enemy.health-=(enemyDamage/2)
                break
            case ShieldStatus.NONE:
                description+=`\nEnemy attacks! ${enemyDamage} damage.`
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

export {battleSessions, BattleSession, Enemy, ShieldStatus, battleCommand, battleListener}