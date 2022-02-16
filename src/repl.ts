import readline from "readline"

/**
 * Provides an auto-completion interface for readline.createInterface()
 */
export const makeCommandCompleter =
	(completions: string[]) =>
	(input: string): [string[], string] => {
		const hits = completions.filter((c) => c.startsWith(input))
		return [hits.length ? hits : completions, input]
	}

type CommandHandler = (command: string) => string

/*
 * Abstracts the logic for printing our prompt, reading commands from the user,
 * handling interrupts, etc.
 */
export class REPL {
	private rl: readline.Interface
	private outputStream: NodeJS.WritableStream
	private commandHandler: CommandHandler

	constructor(
		inputStream: NodeJS.ReadableStream,
		outputStream: NodeJS.WritableStream,
		commandHandler: CommandHandler
	) {
		this.rl = readline.createInterface({
			input: inputStream,
			output: outputStream,
			// TODO: add an auto-completion interface
		})
		this.outputStream = outputStream
		this.commandHandler = commandHandler

		// bind our run function so that we can pass around references to it as
		// callback conveniently
		this.run = this.run.bind(this)
	}

	public run(): void {
		this.rl.prompt()

		this.rl.on("SIGINT", () => {
			this.outputStream.write("Goodbye!\n")
			this.rl.close()
			process.exit(0)
		})

		this.rl.on("line", (input: string) => {
			try {
				const response = this.commandHandler(input)
				this.outputStream.write(response + "\n")
			} catch (e: any) {
				const message =
					// safety: it's a typeof
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					typeof e.message === "string"
						? `${(e as Error).message}\n`
						: `${e as string}\n`
				this.outputStream.write(`) ERROR, ${message}`)
			}
			this.rl.prompt()
		})
	}
}
