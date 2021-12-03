import db from "./database"

interface Punishment {
    guild: string,
    user: string,
    author: string,
    startDate: number,
    endDate: number | null,
    type: PunishmentType
}

enum PunishmentType {
    BAN,
    MUTE
}

function savePunishments(punishments: Punishment[], serverId: string) {
    if (!db.exists(`/punishments/${serverId}`)) db.push(`/punishments/${serverId}`, [])    
    db.push(`/punishments/${serverId}`, punishments)
}

function getPunishments(serverId: string): Punishment[] {
    if (!db.exists(`/punishments/${serverId}`)) db.push(`/punishments/${serverId}`, [])    
    return <Punishment[]>db.getData(`/punishments/${serverId}`)
}

function getAllPunishments(): Record<string, Punishment[]> {
    if (!db.exists("/punishments")) return {}
    return db.getObject("/punishments")
}

export {Punishment, PunishmentType, savePunishments, getPunishments, getAllPunishments}