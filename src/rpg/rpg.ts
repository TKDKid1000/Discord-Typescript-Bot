import db from "../database"
import { User } from "../levels"

if (!db.exists("/rpg")) db.push("/rpg", [])

interface Player {
    id: string,
    level: number,
    health: number,
    maxHealth: number,
    money: number,
    stats: Stats,
    inv: Inventory
}

interface Stats {
    killCount: number,
    deathCount: number
}

interface Inventory {
    currentWeapon: Weapon | null,
    items: Item[],
    materials: {type: Material, count: number}[]
}


interface Weapon extends Item {
    name: string,
    speed: number,
    hitChance: number,
    damage: {high: number, low: number}
}

interface Item {
    recipe: {material: Material, count: number}[],
    count: number
}

enum Material {
    rock,
    iron,
    cactus,
    sand,
    fish,
    water,
    apple,
    wood
}

const Weapons: Weapon[] = [
    {
        name: "katana",
        speed: 10,
        hitChance: 75,
        damage: { high: 40, low: 15 },
        count: 1,
        recipe: [{material: Material.iron, count: 8}, {material: Material.wood, count: 3}]
    }
]

function saveRpgPlayer(user: Player) {
    if (getRpgPlayer(user.id)) {
        db.push(`/rpg[${getRpgPlayers().indexOf(user)}]`, user)
    } else {
        db.push("/rpg[]", user)
    }
}

function getRpgPlayer(id: string): Player | undefined {
    const user = getRpgPlayers().find(user => user.id === id)
    return user
}

function getRpgPlayers(): Player[] {
    return <Player[]>db.getData("/rpg")
}

const defaultRpgPlayer = (id: string) => {
    return {
        id: id,
        health: 100,
        inv: {
            currentWeapon: null,
            items: [],
            materials: []
        },
        level: 1,
        maxHealth: 100,
        money: 0.0,
        stats: {
            deathCount: 0,
            killCount: 0
        }
    }
}

defaultRpgPlayer

export {Player, Stats, Inventory, Weapons, Weapon, Item, Material, saveRpgPlayer, getRpgPlayer, getRpgPlayers, defaultRpgPlayer}