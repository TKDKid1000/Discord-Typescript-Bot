import { readFileSync } from "fs"

const config: any = JSON.parse(readFileSync("./config.json").toString())
const blockedWords: any = JSON.parse(readFileSync("./blocked-words.json").toString())

export default config
export {blockedWords}