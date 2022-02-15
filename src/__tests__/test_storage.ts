import { Storage, InMemoryStorage } from "../storage"

describe("storage", () => {
	let storage: Storage<string, string>

	beforeEach(() => {
		storage = new InMemoryStorage<string, string>()
	})

	it("can add and retrieve a key", () => {
		storage.add("foo", "bar")
		expect(storage.keys()).toContain("foo")
	})

	it("throws an error if the value already exists for the key", () => {
		storage.add("foo", "bar")
		const shouldThrow = () => storage.add("foo", "bar")

		expect(shouldThrow).toThrowError("member already exists for key")
	})

	it("returns all the values for a given key, throws if not present", () => {
		storage.add("foo", "bar")
		storage.add("foo", "baz")

		expect(Array.from(storage.members("foo"))).toEqual(["bar", "baz"])
		expect(() => storage.members("bad")).toThrowError("key does not exist")
	})

	it("removes a member from a key, throws if key or member does not exist", () => {
		storage.add("foo", "bar")
		storage.add("foo", "baz")

		storage.remove("foo", "bar")
		expect(storage.members("foo")).not.toContain("bar")
		expect(() => storage.remove("foo", "bad")).toThrowError(
			"member does not exist"
		)

		// removing the last item should remove the key
		storage.remove("foo", "baz")
		expect(() => storage.members("foo")).toThrow("key does not exist")

		expect(() => storage.remove("blah", "bad")).toThrow(
			"key does not exist"
		)
	})

	it("removes all values from a key, throws if key does not exist", () => {
		storage.add("foo", "bar")
		storage.add("foo", "baz")

		expect(Array.from(storage.members("foo"))).toEqual(["bar", "baz"])
		storage.removeAll("foo")
		expect(Array.from(storage.keys()).length).toEqual(0)

		expect(() => storage.removeAll("bad")).toThrowError(
			"key does not exist"
		)
	})

	it("clears all keys and members", () => {
		storage.add("foo", "bar")
		storage.add("quux", "baz")

		expect(Array.from(storage.keys())).toEqual(["foo", "quux"])
		storage.clear()
		expect(Array.from(storage.keys())).toEqual([])
	})

	it("can get whether a key exists", () => {
		storage.add("foo", "bar")
		expect(storage.keyExists("foo")).toEqual(true)
		expect(storage.keyExists("baz")).toEqual(false)
	})

	it("can get whether a member exists for a given key", () => {
		storage.add("foo", "bar")
		expect(storage.memberExists("foo", "bar")).toEqual(true)
		expect(() => storage.memberExists("blah", "bar")).toThrowError(
			"key does not exist"
		)
	})

	it("can get all members", () => {
		storage.add("foo", "bar")
		storage.add("foo", "baz")
		expect(Array.from(storage.allMembers())).toEqual(["bar", "baz"])
	})

	it("can get all items", () => {
		expect(Array.from(storage.items())).toEqual([])
		storage.add("foo", "bar")
		storage.add("foo", "baz")
		storage.add("bang", "bar")

		expect(Array.from(storage.items())).toEqual([
			["foo", "bar"],
			["foo", "baz"],
			["bang", "bar"],
		])
	})
})
