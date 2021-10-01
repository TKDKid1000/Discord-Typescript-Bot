import { SlashCommandBuilder } from "@discordjs/builders"
import { Client, Intents } from "discord.js"
import config from "./config"
import * as fs from "fs"
import * as path from "path"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import Command from "./command"

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
    console.log(`Logged in as ${client.user.tag}`)
    const rest = new REST({version:"9"})
    rest.setToken(config["token"])
    rest.put(
        Routes.applicationGuildCommands(client.application.id, config["guild"]),
        { body: commandBuilders }
    )
    // rest.get(Routes.applicationGuildCommands(client.application.id, config["guild"])).then(console.log).catch(console.error)
})

client.on("interactionCreate", async interaction => {
    if (interaction != null) {
        if (interaction.isCommand()) {
            commands.forEach(command => {
                if (interaction.commandName === command.builder.name) {
                    command.execution.execute(interaction)
                }
            })
        }
    }
})

client.login(config["token"])