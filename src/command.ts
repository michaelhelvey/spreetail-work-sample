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
 * Formats the response for a single string message, e.g. "Added"
 */
function singleValueResponse(message: string): string {
	return `) ${message}`
}

/*
 * Creates a response from an iterable of objects
 */
function responseFromIterable<T>(iter: Iterable<T> | ArrayLike<T>): string {
	const list = Array.isArray(iter) ? iter : Array.from(iter)
	if (!list.length) {
		return "(empty set)"
	}

	return list.map((v, i) => `${i + 1}) ${v}`).join("\n")
}

/*
 * Very simple "parsing error handler" which just checks the number of
 * arguments to a command against a set value
 */
function checkArgsLen(argsLen: number, expectedLen: number, syntax: string) {
	if (!(argsLen === expectedLen)) {
		throw new Error(`Syntax error; expected ${syntax}`)
	}
}

/*
 * Given some backing storage, implements our application logic for handling
 * commands with string key/value pairs. Throws an Error instance on any syntax
 * error and allows errors from the backing storage instance to bubble up.
 *
 * Note: currently this is specialized for strings as this allows us to avoid
 * writing any kind of more detailed parser interface for serializing types.
 */
export const stringStorageHandler =
	(storage: Storage<string, string>) =>
	(input: string): string => {
		const args = input.split(" ")
		const argsLen = args.length

		switch (args[0]) {
			case Command.KEYS: {
				checkArgsLen(argsLen, 1, "KEYS")
				const keys = storage.keys()
				return responseFromIterable(keys)
			}
			case Command.ADD: {
				checkArgsLen(argsLen, 3, "ADD <key> <value>")
				storage.add(args[1], args[2])
				return singleValueResponse("Added")
			}
			case Command.MEMBERS: {
				checkArgsLen(argsLen, 2, "MEMBERS <key>")
				const members = storage.members(args[1])
				return responseFromIterable(members)
			}
			case Command.REMOVE: {
				checkArgsLen(argsLen, 3, "REMOVE <key> <value>")
				storage.remove(args[1], args[2])
				return singleValueResponse("Removed")
			}
			case Command.REMOVEALL: {
				checkArgsLen(argsLen, 2, "REMOVEALL <key>")
				storage.removeAll(args[1])
				return singleValueResponse("Removed")
			}
			case Command.CLEAR: {
				checkArgsLen(argsLen, 1, "CLEAR")
				storage.clear()
				return singleValueResponse("Cleared")
			}
			case Command.KEYEXISTS: {
				checkArgsLen(argsLen, 2, "KEYEXISTS <key>")
				const result = storage.keyExists(args[1])
				return singleValueResponse(String(result))
			}
			case Command.MEMBEREXISTS: {
				checkArgsLen(argsLen, 3, "MEMBEREXISTS <key> <value>")
				const result = storage.memberExists(args[1], args[2])
				return singleValueResponse(String(result))
			}
			case Command.ALLMEMBERS: {
				checkArgsLen(argsLen, 1, "ALLMEMBERS")
				const members = storage.allMembers()
				return responseFromIterable(members)
			}
			case Command.ITEMS: {
				checkArgsLen(argsLen, 1, "ITEMS")
				// can't directly use responseFromIterable because we need to
				// format our key-value pairs first
				const items = Array.from(storage.items()).map(
					([key, value]) => `${key}: ${value}`
				)
				return responseFromIterable(items)
			}
			default:
				throw new Error(`Unknown command '${input}'`)
		}
	}

// Export private utilities for our tests without exposing them directly to the
// rest of the module.
export const _private = {
	responseFromIterable,
	singleValueResponse,
	checkArgsLen,
}
