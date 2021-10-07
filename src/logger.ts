import { MessageEmbed } from "discord.js"
import winston from "winston"
import Transport from "winston-transport"
import {client} from "./bot"
import config from "./config"

class DiscordLogger extends Transport {
    constructor(opts: winston.transport.TransportStreamOptions) {
        super(opts)
        opts.format = winston.format.json()
    }

    log(info: any, next: () => void) {
        if (config.log.enabled) {
            client.guilds.cache.forEach(async (guild) => {
                const channel = guild.channels.cache.find(c => c.name === config.log.channel)
                if (channel) {
                    if (channel.isText()) {
                        channel.send({embeds: [new MessageEmbed().setTitle("Logger").setDescription(`:clipboard: ${info.message}`).setAuthor(client.user.username).setColor("BLUE")]})
                    }
                }
            })
        }
    }
}

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
        winston.format.splat(),
        winston.format.colorize(),
        winston.format.printf((({level, message, label, timestamp}) => `${timestamp} ${label || '-'} ${level}: ${message}`))
    ),
    defaultMeta: {
        service: "user-service"
    },
    transports: [
        new winston.transports.File({
            filename: "combined.log",
            dirname: "./logs"
        }),
        new winston.transports.File({
            filename: "error.log",
            dirname: "./logs",
            level: "error"
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
                winston.format.splat(),
                winston.format.colorize(),
                winston.format.printf((({level, message, label, timestamp}) => `${timestamp} ${label || '-'} ${level}: ${message}`),)
            )
        }),
        new DiscordLogger({
            level: "info"
        })
    ]
})


export {logger}