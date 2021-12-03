import { SlashCommandBuilder } from "@discordjs/builders"
import { Client, Intents } from "discord.js"
import config from "./config"
import * as fs from "fs"
import * as path from "path"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import Command from "./command"
import { logger } from "./logger"

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES
    ],
    retryLimit: Infinity,
    
})

const commands: Array<Command> = new Array<Command>()

fs.readdirSync(path.join(__dirname, "commands")).forEach(file => {
    if (file.endsWith(".js")) {
        const _command = require(path.join(__dirname, "commands", file))    
        const command = <Command>_command.default
        commands.push(command)
    }
})

fs.readdirSync(path.join(__dirname, "listeners")).forEach(file => {
    if (file.endsWith(".js")) {
        const _listener = require(path.join(__dirname, "listeners", file))    
        const listener = _listener.default
        listener(client)
    }
})

const commandBuilders: Array<SlashCommandBuilder> = (() => {
    const builders: Array<SlashCommandBuilder> = new Array<SlashCommandBuilder>()
    commands.forEach(cmd => {
        builders.push(cmd.builder)
    })
    return builders
})()

client.on("ready", () => {
    logger.info(`Logged in as ${client.user.tag}`)
    const rest = new REST({version:"9"})
    rest.setToken(config["token"])
    if (process.env.NODE_ENV === "production") {
        rest.put(
            Routes.applicationCommands(client.application.id),
            { body: commandBuilders }
        )
        logger.info("Registered public slash commands")
    } else {
        rest.put(
            Routes.applicationGuildCommands(client.application.id, config["guild"]),
            { body: commandBuilders }
        )
        logger.info("Registered guild slash commands")
    }
})

client.on("rateLimit", async rateLimit => {
    logger.error(`Bot rate limited for ${rateLimit.timeout}`)
})

client.on("interactionCreate", async interaction => {
    if (interaction != null) {
        if (interaction.isCommand()) {
            logger.info(`${interaction.user.id} executed command ${interaction.commandName}`)
            const command = commands.find(command => interaction.commandName === command.builder.name)
            if (command) 
                command.execution.execute(interaction)
        }
    }
})

client.login(config["token"])

export {client}