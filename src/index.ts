import readline from "readline"
import { program } from "commander"

import { Command } from "./command"

/*
 ***************************************************************
 * Application logic
 ***************************************************************
 */

/*
 ***************************************************************
 * REPL Frontend
 ***************************************************************
 */

function processREPLCommand(command: string): void {
	switch (command) {
		case Command.KEYS:
			break
		default:
			console.log(`Error: unknown command: ${command}`)
	}
}

const availableCommands = [
	"KEYS",
	"MEMBERS",
	"ADD",
	"REMOVE",
	"REMOVEALL",
	"CLEAR",
	"KEYEXISTS",
	"MEMBEREXISTS",
	"ALLMEMBERS",
	"ITEMS",
]

/**
 * Provides an auto-completion interface for readline.createInterface()
 */
const replCompleter =
	(completions: string[]) =>
	(input: string): [string[], string] => {
		const hits = completions.filter((c) => c.startsWith(input))
		return [hits.length ? hits : completions, input]
	}

/**
 * Runs a REPL that will prompt the user for a command, and then run that
 * command against the application
 */
function runREPL(): void {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		completer: replCompleter(availableCommands),
	})

	rl.prompt()

	rl.on("SIGINT", () => {
		console.log("Goodbye!")
		rl.close()
		process.exit(0)
	})

	rl.on("line", (input: string) => {
		processREPLCommand(input)
		rl.prompt()
	})
}

program
	.name("multivalue-dict")
	.description("CLI that stores a multi-value string dictionary in memory")
	.version("1.0.0")

program
	.command("repl")
	.description("Start a REPL to run commands against the in-memory storage")
	.action(runREPL)

program.parse()
