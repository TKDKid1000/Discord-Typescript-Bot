import { readFileSync } from "fs"

const config: any = JSON.parse(readFileSync("./config.json").toString())
const blockedWords: any = JSON.parse(readFileSync("./blocked-words.json").toString())

export default {
    token: config.token,
    clientid: config.clientid,
    guild: config.guild,
    roles: {
        default: config.roles.default
    },
    channels: {
        rules: config.channels.rules,
        welcome: config.channels.welcome
    },
    music: {
        loadCacheTime: config.music.loadCacheTime
    },
    messages: {
        welcome: config.messages.welcome,
        levelup: config.messages.levelup
    },
    levels: {
        random: [config.levels.random[0], config.levels.random[0]],
        xp: config.levels.xp
    },
    log: {
        enabled: config.log.enabled,
        channel: config.log.channel
    }
}
export {blockedWords}