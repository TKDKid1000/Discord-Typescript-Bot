import db from "./database"

if (!db.exists("/punishments")) db.push("/punishments", [])

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

function savePunishments(punishments: Punishment[]) {
    db.push("/punishments", punishments)
}

function getPunishments(): Punishment[] {
    return <Punishment[]>db.getData("/punishments")
}

export {Punishment, PunishmentType, savePunishments, getPunishments}