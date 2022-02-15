import type { Storage } from "./storage"

export const Command = {
	KEYS: "KEYS",
	MEMBERS: "MEMBERS",
	ADD: "ADD",
	REMOVE: "REMOVE",
	REMOVEALL: "REMOVEALL",
	CLEAR: "CLEAR",
	KEYEXISTS: "KEYEXISTS",
	MEMBEREXISTS: "MEMBEREXISTS",
	ALLMEMBERS: "ALLMEMBERS",
	ITEMS: "ITEMS",
}

/*
 * Given some backing storage for strings, implements our application logic for
 * handling commands.
 *
 * Note: Currently is string specific so that we don't have to write some kind
 * of key/value parse to string sort of interface.
 */
export const multiValueDictionaryHandler =
	(storage: Storage<string, string>) =>
	(input: string): string => {
		const args = input.split(" ")
		const argsLen = args.length

		// TODO: Implement repetive command result formatting logic + the rest of our commands
		switch (args[0]) {
			case Command.KEYS: {
				if (!(argsLen === 1)) {
					throw new Error(") Syntax error; expected KEYS")
				}
				const keys = storage.keys()
				return Array.from(keys)
					.map((v, i) => `${i + 1}) ${v}`)
					.join("\n")
			}
			case Command.ADD: {
				if (!(argsLen === 3)) {
					throw new Error(
						") Syntax error; expected ADD <key> <value>"
					)
				}
				storage.add(args[1], args[2])
				return ") Added"
			}
			default:
				throw new Error(`) Unknown command ${input}`)
		}
	}
