import { userMention } from "@discordjs/builders"
import { Client, Message, MessageEmbed, TextChannel } from "discord.js"
import config from "../config"
import { battleListener, battleSessions, ShieldStatus } from "../rpg/battle"
import { getRpgPlayer, Material, saveRpgPlayer } from "../rpg/rpg"
import { randomInt, sleep } from "../utils"

export default function(client: Client) {
    client.on("interactionCreate", async interaction => {
        if (interaction.isButton()) {
            if (interaction.customId.startsWith("RPG.")) {
                if (interaction.customId.startsWith("RPG.Battle.")) battleListener(interaction)
            }
        }
    })
}