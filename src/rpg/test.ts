import { Player } from "./rpg"

var player: Player = {
    health: 100, // current health
    id: "01234567", // user id
    inv: { // inventory
        currentWeapon: null, // current weapon (null means none)
        items: [], // list of items, an item is just something with a crafting recipe
        materials: [] // list of materials, a material is a crafting ingredient and a count
    },
    level: 1, // user level (not /rank level, rpg level)
    maxHealth: 100, // max possible health
    money: 100.0, // money
    stats: { // statistics (I can add more, this is all I thought of right now)
        deathCount: 0, // amount of times you died
        killCount: 0 // amount of kills
    }
}