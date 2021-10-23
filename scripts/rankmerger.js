/**
 * This is a simple script to merge the old members.json from my python bot into this bot's level system
 */

const fs = require("fs")

// set this variable to old members.json value
const json = {"697437846507749463": {"name": "Frank Reynolds", "tag": "4231", "xp": 207, "level": 14}, "711259489239695390": {"name": "ARMI\u30c4", "tag": "5080", "xp": 896, "level": 60}, "574009401044893697": {"name": "TKDKid1000", "tag": "0406", "xp": 313, "level": 94}, "392351781415419904": {"name": "RaZe", "tag": "5555", "xp": 371, "level": 1}, "583453168579379225": {"name": "AeroPoptart", "tag": "4147", "xp": 690, "level": 9}, "760876846753251382": {"name": "Boiniak", "tag": "3193", "xp": 660, "level": 3}, "779029262563934208": {"name": "GitHub", "tag": "0000", "xp": 19, "level": 1}, "779939653750358056": {"name": "RPG Bot", "tag": "0405", "xp": 0, "level": 0}, "235088799074484224": {"name": "Rythm", "tag": "3722", "xp": 17, "level": 1}, "706280678362316900": {"name": "legion", "tag": "0994", "xp": 963, "level": 7}, "521499753826222093": {"name": "Khunberry", "tag": "8381", "xp": 499, "level": 1}, "541814300877127707": {"name": "Among us", "tag": "5007", "xp": 413, "level": 1}, "564233724367994881": {"name": "kirva1", "tag": "4968", "xp": 171, "level": 1}, "782460117882765332": {"name": "bot USM", "tag": "6674", "xp": 142, "level": 1}, "726812880548397208": {"name": "omson", "tag": "3502", "xp": 196, "level": 1}, "697428975378628680": {"name": "Mayachan", "tag": "0483", "xp": 59, "level": 1}, "591668926203691038": {"name": "neko car", "tag": "1731", "xp": 1, "level": 1}, "417180751570665472": {"name": "winter116", "tag": "0001", "xp": 405, "level": 2}, "759242908464578570": {"name": "69", "tag": "0475", "xp": 182, "level": 1}, "787389129036922947": {"name": "snows alt maybe", "tag": "7174", "xp": 119, "level": 1}, "681221451101241365": {"name": "Mr_Mehico", "tag": "1764", "xp": 930, "level": 5}, "780985443314565180": {"name": "Tofu", "tag": "2002", "xp": 28, "level": 1}, "818224916331102229": {"name": "Scrubby", "tag": "7632", "xp": 536, "level": 22}, "849258749164257320": {"name": "no u 1234", "tag": "8129", "xp": 9, "level": 1}, "744452617878503514": {"name": "TKDKid1000's Alt", "tag": "2522", "xp": 1, "level": 1}, "816316253752393728": {"name": "\ud835\ude3e\ud835\ude56\ud835\ude5e\ud835\ude6f\ud835\ude6f\ud835\udc80\ud835\udc7b", "tag": "3105", "xp": 287, "level": 1}, "755474178362179776": {"name": "YeJe-Orges", "tag": "3593", "xp": 121, "level": 1}}
const levels = []

for (var key in json) {
    const element = json[key]
    levels.push({id: key, level: element.level, xp: element.xp})
}

const database = JSON.parse(fs.readFileSync("./database.json"))
database.levels = levels
fs.writeFileSync("./database.json", JSON.stringify(database))
