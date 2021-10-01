import { Client, GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed, Snowflake } from "discord.js"
import config from "../config"
import fs from "fs"

var calculators: Map<Snowflake, Calculator> = new Map<Snowflake, Calculator>()

interface Calculator {
    equation: string,
    error: string
}

export {calculators, Calculator}

export default function(client: Client) {

    client.on("interactionCreate", async interaction => {
        if (interaction.isButton()) {
            if (!interaction.customId.startsWith("Calculator.")) return
            var calc = calculators.get(interaction.message.id)
            if (calc === undefined) 
                calculators.set(interaction.message.id, {equation: "", error: ""})
            calc.error = ""
            const message = <Message>interaction.message
            switch (interaction.customId) {
                case "Calculator.close": {
                    calculators.delete(message.id)
                    await message.delete()
                    return
                }
                case "Calculator.clear": {
                    calc.equation=""
                    break
                }
                case "Calculator.backspace": {
                    if (calc.equation.length > 0) {
                        calc.equation = calc.equation.slice(0, -1)
                    }
                    break
                }
                case "Calculator.divide": {
                    calc.equation+="÷"
                    break
                }
                case "Calculator.7": {
                    calc.equation+="7"
                    break
                }
                case "Calculator.8": {
                    calc.equation+="8"
                    break
                }
                case "Calculator.9": {
                    calc.equation+="9"
                    break
                }
                case "Calculator.multiply": {
                    calc.equation+="×"
                    break
                }
                case "Calculator.4": {
                    calc.equation+="4"
                    break
                }
                case "Calculator.5": {
                    calc.equation+="5"
                    break
                }
                case "Calculator.6": {
                    calc.equation+="6"
                    break
                }
                case "Calculator.subtract": {
                    calc.equation+="-"
                    break
                }
                case "Calculator.3": {
                    calc.equation+="3"
                    break
                }
                case "Calculator.2": {
                    calc.equation+="2"
                    break
                }
                case "Calculator.1": {
                    calc.equation+="1"
                    break
                }
                case "Calculator.add": {
                    calc.equation+="+"
                    break
                }
                case "Calculator.power": {
                    calc.equation+="^"
                    break
                }
                case "Calculator.0": {
                    calc.equation+="0"
                    break
                }
                case "Calculator.decimal": {
                    calc.equation+="."
                    break
                }
                case "Calculator.equals": {
                    try {
                        var funny = true
                        if (calc.equation == "9+10" && funny) {
                            calc.equation="21"
                        } else if (calc.equation == "69+420" && funny) {
                            calc.equation="nice"
                        } else if (calc.equation == "-8" && funny) {
                            const member = <GuildMember>interaction.member
                            await member.kick("no horny")
                        } else {
                            const equation = calc.equation.replace("^", "**").replace("×", "*").replace("÷", "/")
                            calc.equation=eval(equation)
                        }
                    } catch (error) {
                        calc.error = `\n**Error:** \`${String(error).split("\n")[0]}\``
                    }
                    break
                }
            }
            const embed = new MessageEmbed()
            .setTitle("Calculator")
            .setAuthor(interaction.client.user.username)
            .setDescription(`\`${calc.equation}${calc.equation.length == 0 ? " " : ""}\`${calc.error}`)
            .setColor("BLUE")
            await message.edit({embeds: [embed]})
            await interaction.deferUpdate({fetchReply: false})
        }
    })
}