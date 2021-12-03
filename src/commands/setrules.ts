import { SlashCommandBuilder } from "@discordjs/builders"
import { GuildMember, MessageActionRow, MessageButton, MessageEmbed, Permissions, TextChannel } from "discord.js"
import Command, { Execution } from "../command"

export default new Command(<SlashCommandBuilder>new SlashCommandBuilder().setName("setrules").setDescription("Sets the server rules").addStringOption(option => option.setName("url").setDescription("Message url for rules").setRequired(true)), new Execution(async interaction => {
    const member = <GuildMember>interaction.member
    if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        try {
            const rulesUrl = new URL(interaction.options.getString("url"))
            const [channelId, messageId] = rulesUrl.pathname.split("/").splice(3, 4)
            const channel = interaction.guild.channels.cache.find(c => c.id === channelId)
            if (channel) {
                if (channel.isText()) {
                    const message = await channel.messages.fetch(messageId)
                    if (message) {
                        const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                            .setCustomId("Rules.Accept")
                            .setStyle("SUCCESS")
                            .setLabel("Accept Rules")
                        )
                        const embed = new MessageEmbed()
                        .setColor("BLUE")
                        .setTitle("Rules")
                        .setDescription(message.content)
                        const rulesMessage = await interaction.channel.send({embeds: [embed], components: [row]})
                        await interaction.reply({embeds: [new MessageEmbed().setTitle("Tools").setDescription(`:tools: Created rules at ${rulesMessage.url}`).setAuthor(interaction.client.user.username).setColor("BLUE")], ephemeral: true})
                    } else {
                        await interaction.reply({embeds: [new MessageEmbed().setTitle("Tools").setDescription(`:tools: The specified message could not be found!`).setAuthor(interaction.client.user.username).setColor("BLUE")], ephemeral: true})
                    }
                }
            } else {
                await interaction.reply({embeds: [new MessageEmbed().setTitle("Tools").setDescription(`:tools: The specified channel could not be found!`).setAuthor(interaction.client.user.username).setColor("BLUE")], ephemeral: true})
            }
        } catch (err) {
            await interaction.reply({embeds: [new MessageEmbed().setTitle("Tools").setDescription(`:tools: The specified url is not valid!`).setAuthor(interaction.client.user.username).setColor("BLUE")], ephemeral: true})
        }
    } else {
        await interaction.reply({embeds: [new MessageEmbed().setTitle("Tools").setDescription(`:tools: You do not have permission to use that command`).setAuthor(interaction.client.user.username).setColor("BLUE")], ephemeral: true})
    }    
}))