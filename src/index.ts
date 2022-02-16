import { program } from "commander"
import { REPL, makeCommandCompleter } from "./repl"
import { InMemoryStorage } from "./storage"
import { stringStorageHandler, Command } from "./command"

// Bootstrapping code for our application

const storage = new InMemoryStorage<string, string>()
const repl = new REPL(
	process.stdin,
	process.stdout,
	stringStorageHandler(storage),
	makeCommandCompleter(Object.keys(Command))
)

program
	.name("multivalue-dict")
	.description("CLI that stores a multi-value string dictionary in memory")
	.version("1.0.0")

program
	.command("repl")
	.description("Start a REPL to run commands against the in-memory storage")
	// safety: we know this is bound because we explicitly bind it in the constructor
	// eslint-disable-next-line @typescript-eslint/unbound-method
	.action(repl.run)

program.parse()
