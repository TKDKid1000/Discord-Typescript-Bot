import db from "./database"

if (!db.exists("/levels")) db.push("/levels", [])

interface User {
    id: string,
    level: number,
    xp: number
}

function saveUser(user: User) {
    if (getUser(user.id)) {
        db.push(`/levels[${getUsers().indexOf(user)}]`, user)
    } else {
        db.push("/levels[]", user)
    }
}

function getUser(id: string): User | undefined {
    const user = getUsers().find(user => user.id === id)
    return user
}

function getUsers(): User[] {
    return <User[]>db.getData("/levels")
}

export {User, saveUser, getUser, getUsers}