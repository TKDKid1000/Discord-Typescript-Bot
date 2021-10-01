import { SlashCommandBuilder } from "@discordjs/builders"
import { GuildMember, MessageActionRow, MessageButton, MessageEmbed } from "discord.js"
import Command, { Execution } from "../command"
import {Calculator, calculators} from "../listeners/calculatorlistener"

export default new Command(new SlashCommandBuilder().setName("calculator").setDescription("Opens a calculator"), new Execution(async interaction => {
    const member = <GuildMember>interaction.member
    const rows = [
        new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("Calculator.close")
            .setStyle("DANGER")
            .setLabel("Close"),
            new MessageButton()
            .setCustomId("Calculator.clear")
            .setStyle("SECONDARY")
            .setLabel("C"),
            new MessageButton()
            .setCustomId("Calculator.backspace")
            .setStyle("SECONDARY")
            .setLabel("Back"),
            new MessageButton()
            .setCustomId("Calculator.divide")
            .setStyle("SECONDARY")
            .setLabel("÷")
        ),
        new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("Calculator.7")
            .setStyle("PRIMARY")
            .setLabel("7"),
            new MessageButton()
            .setCustomId("Calculator.8")
            .setStyle("PRIMARY")
            .setLabel("8"),
            new MessageButton()
            .setCustomId("Calculator.9")
            .setStyle("PRIMARY")
            .setLabel("9"),
            new MessageButton()
            .setCustomId("Calculator.multiply")
            .setStyle("SECONDARY")
            .setLabel("×")
        ),
        new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("Calculator.4")
            .setStyle("PRIMARY")
            .setLabel("4"),
            new MessageButton()
            .setCustomId("Calculator.5")
            .setStyle("PRIMARY")
            .setLabel("5"),
            new MessageButton()
            .setCustomId("Calculator.6")
            .setStyle("PRIMARY")
            .setLabel("6"),
            new MessageButton()
            .setCustomId("Calculator.subtract")
            .setStyle("SECONDARY")
            .setLabel("-")
        ),
        new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("Calculator.3")
            .setStyle("PRIMARY")
            .setLabel("3"),
            new MessageButton()
            .setCustomId("Calculator.2")
            .setStyle("PRIMARY")
            .setLabel("2"),
            new MessageButton()
            .setCustomId("Calculator.1")
            .setStyle("PRIMARY")
            .setLabel("1"),
            new MessageButton()
            .setCustomId("Calculator.add")
            .setStyle("SECONDARY")
            .setLabel("+")
        ),
        new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("Calculator.power")
            .setStyle("PRIMARY")
            .setLabel("^"),
            new MessageButton()
            .setCustomId("Calculator.0")
            .setStyle("PRIMARY")
            .setLabel("0"),
            new MessageButton()
            .setCustomId("Calculator.decimal")
            .setStyle("PRIMARY")
            .setLabel("."),
            new MessageButton()
            .setCustomId("Calculator.equals")
            .setStyle("SUCCESS")
            .setLabel("=")
        ),
    ]
    const embed = new MessageEmbed()
    .setTitle("Calculator")
    .setAuthor(interaction.client.user.username)
    .setDescription(`\` \``)
    .setColor("BLUE")
    await interaction.reply({embeds: [embed], components: rows})
    calculators.set((await interaction.fetchReply()).id, {equation: "", error: ""})
}))