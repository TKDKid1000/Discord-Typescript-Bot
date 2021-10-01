import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js"
import { sleep } from "../utils"
import { defaultRpgPlayer, getRpgPlayer, Player, saveRpgPlayer, Weapon, Weapons } from "./rpg"

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
            await interaction.editReply({embeds: [new MessageEmbed().setTitle("RPG").setDescription(`:video_game: It's your turn! Click a command.`).setAuthor(interaction.client.user.username).setColor("BLUE")], components: [buttons]})
            battleSessions.push(battleSession)
        } else {
            await interaction.reply({embeds: [new MessageEmbed().setTitle("RPG").setDescription(`:video_game: You are already in battle!`).setAuthor(interaction.client.user.username).setColor("BLUE")], components: [], ephemeral: true})
        }
    } else {
        saveRpgPlayer(defaultRpgPlayer(interaction.user.id))
        await interaction.reply({embeds: [new MessageEmbed().setTitle("RPG").setDescription(`:video_game: Created RPG profile, please run this command again.`).setAuthor(interaction.client.user.username).setColor("BLUE")], components: [], ephemeral: true})
    }
}

export {battleSessions, BattleSession, Enemy, ShieldStatus, battleCommand}