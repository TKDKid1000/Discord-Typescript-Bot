const fs = require("fs")
const path = require("path")
const appPath = path.join(__dirname, "..", "app")
fs.rmSync(appPath, {recursive: true, force: true})