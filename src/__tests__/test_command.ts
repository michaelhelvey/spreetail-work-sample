/* eslint @typescript-eslint/unbound-method: 0 */

import type { Storage } from "../storage"
import { _private, multiValueDictionaryHandler } from "../command"

const { responseFromIterable, singleValueResponse, checkArgsLen } = _private

describe("command response formatters", () => {
	it("singleValueResponse", () => {
		expect(singleValueResponse("Added")).toEqual(") Added")
	})

	it("responseFromIterable: with values", () => {
		expect(responseFromIterable(["foo", "bar"])).toEqual("1) foo\n2) bar")
	})

	it("responseFromIterable: empty set", () => {
		expect(responseFromIterable([])).toEqual("(empty set)")
	})

	it("checkArgsLen", () => {
		expect(checkArgsLen(1, 1, "blah")).toBeUndefined()
		expect(() => checkArgsLen(1, 2, "foo bar")).toThrowError(
			"Syntax error; expected foo bar"
		)
	})
})

describe("command handler", () => {
	let storageMock: Storage<string, string>
	let handler: (command: string) => string

	beforeEach(() => {
		storageMock = {} as Storage<string, string>
		handler = multiValueDictionaryHandler(storageMock)
	})

	it("unknown command", () => {
		expect(() => handler("blah")).toThrowError("Unknown command 'blah'")
	})

	it("keys command", () => {
		storageMock.keys = jest.fn().mockReturnValue([])
		const result = handler("KEYS")
		expect(storageMock.keys).toHaveBeenCalled()
		expect(result).toEqual("(empty set)")

		expect(() => handler("KEYS blah")).toThrowError("KEYS")
	})

	it("add command", () => {
		storageMock.add = jest.fn()
		const result = handler("ADD foo bar")
		expect(result).toEqual(") Added")
		expect(storageMock.add).toHaveBeenCalledWith("foo", "bar")
		expect(() => handler("ADD")).toThrowError("ADD <key> <value>")
	})

	it("members command", () => {
		storageMock.members = jest.fn().mockReturnValue(["foo"])
		const result = handler("MEMBERS foo")
		expect(storageMock.members).toHaveBeenCalled()
		expect(result).toEqual("1) foo")
		expect(() => handler("MEMBERS")).toThrowError("MEMBERS <key>")
	})

	it("remove command", () => {
		storageMock.remove = jest.fn()
		const result = handler("REMOVE foo bar")
		expect(storageMock.remove).toHaveBeenCalledWith("foo", "bar")
		expect(result).toEqual(") Removed")
		expect(() => handler("REMOVE")).toThrowError("REMOVE <key> <value>")
	})

	it("removeall command", () => {
		storageMock.removeAll = jest.fn()
		const result = handler("REMOVEALL foo")
		expect(storageMock.removeAll).toHaveBeenCalledWith("foo")
		expect(result).toEqual(") Removed")
		expect(() => handler("REMOVEALL")).toThrowError("REMOVEALL <key>")
	})

	it("clear command", () => {
		storageMock.clear = jest.fn()
		const result = handler("CLEAR")
		expect(storageMock.clear).toHaveBeenCalledWith()
		expect(result).toEqual(") Cleared")
		expect(() => handler("CLEAR foo")).toThrowError("CLEAR")
	})

	it("keyexists command", () => {
		storageMock.keyExists = jest.fn().mockReturnValue(true)
		const result = handler("KEYEXISTS foo")
		expect(storageMock.keyExists).toHaveBeenCalledWith("foo")
		expect(result).toEqual(") true")
		expect(() => handler("KEYEXISTS blah blah")).toThrowError(
			"KEYEXISTS <key>"
		)
	})

	it("memberexists command", () => {
		storageMock.memberExists = jest.fn().mockReturnValue(false)
		const result = handler("MEMBEREXISTS foo bar")
		expect(storageMock.memberExists).toHaveBeenCalledWith("foo", "bar")
		expect(result).toEqual(") false")
		expect(() => handler("MEMBEREXISTS")).toThrowError(
			"MEMBEREXISTS <key> <value>"
		)
	})

	it("allmembers command", () => {
		storageMock.allMembers = jest.fn().mockReturnValue(["baz"])
		const result = handler("ALLMEMBERS")
		expect(storageMock.allMembers).toHaveBeenCalled()
		expect(result).toEqual("1) baz")
		expect(() => handler("ALLMEMBERS quux")).toThrowError("ALLMEMBERS")
	})

	it("items command", () => {
		storageMock.items = jest.fn().mockReturnValue([
			["foo", "bar"],
			["foo", "baz"],
		])
		const result = handler("ITEMS")
		expect(storageMock.items).toHaveBeenCalled()
		expect(result).toEqual("1) foo: bar\n2) foo: baz")
		expect(() => handler("ITEMS foo")).toThrowError("ITEMS")
	})
})
