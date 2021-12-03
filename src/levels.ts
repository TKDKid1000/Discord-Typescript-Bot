import db from "./database"

interface User {
    id: string,
    level: number,
    xp: number
}

function saveUser(user: User, serverId: string) {
    if (!db.exists(`/levels/${serverId}`)) db.push(`/levels/${serverId}`, [])    
    if (getUser(user.id, serverId)) {
        db.push(`/levels/${serverId}[${getUsers(serverId).indexOf(user)}]`, user)
    } else {
        db.push(`/levels/${serverId}[]`, user)
    }
}

function getUser(id: string, serverId: string): User | undefined {
    if (!db.exists(`/levels/${serverId}`)) db.push(`/levels/${serverId}`, [])    
    const user = getUsers(serverId).find(user => user.id === id)
    return user
}

function getUsers(serverId: string): User[] {
    if (!db.exists(`/levels/${serverId}`)) db.push(`/levels/${serverId}`, [])    
    return <User[]>db.getData(`/levels/${serverId}`)
}

export {User, saveUser, getUser, getUsers}