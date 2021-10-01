import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction } from "discord.js"

class Command {

    private _builder: SlashCommandBuilder
    public get builder(): SlashCommandBuilder {
        return this._builder
    }
    public set builder(v: SlashCommandBuilder) {
        this._builder = v
    }

    private _execution: CommandExecution
    public get execution(): CommandExecution {
        return this._execution
    }
    public set execution(v: CommandExecution) {
        this._execution = v
    }
    
    constructor(builder: SlashCommandBuilder, execution: CommandExecution) {
        this._builder = builder
        this._execution = execution
    }

}

class CommandExecution {

    private _execute: (interaction: CommandInteraction) => void

    constructor(execute: (interaction: CommandInteraction) => void) {
        this._execute = execute
    }

    execute(interaction: CommandInteraction) {
        this._execute(interaction)
    }
    
}

export default Command
export const Execution = CommandExecution