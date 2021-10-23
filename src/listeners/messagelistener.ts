import { Client } from "discord.js"
import Filter from "bad-words"

export default function(client: Client) {
    client.on("messageCreate", async message => {
        const filter = new Filter()
        if (filter.isProfane(message.content)) {
            await message.delete()
        }
    })
}