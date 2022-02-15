/*
 * Interface we are expected to implement for a multi-value dictionary storage
 */
export interface Storage<K, V> {
	add(key: K, value: V): void
	keys(): IterableIterator<K>
	members(key: K): IterableIterator<V>
	remove(key: K, value: V): void
	removeAll(key: K): void
	clear(): void
	keyExists(key: K): boolean
	memberExists(key: K, value: V): boolean
	allMembers(): IterableIterator<V>
	items(): IterableIterator<[K, V]>
}

export class InMemoryStorage<K, V> implements Storage<K, V> {
	// We use a Set rather than a Map for the value type because, while we do
	// need fast adds (where we have to check for set membership), read
	// performance (list the values for a given key) is deemed to be more
	// valuable, and for iterating over values I assume Set.values() will be
	// faster than Map.values() because of memory colocation
	// TODO: benchmark Node's Map vs Set iterators
	private innerStorage: Map<K, Set<V>> = new Map()

	/*
	 * Adds a member to a collection for a given key.  Throw an error if the
	 * member already exists for that key
	 */
	public add(key: K, value: V): void {
		const set = this.getOrCreateSetForKey(key)
		if (set.has(value)) {
			throw new Error("member already exists for key")
		}

		set.add(value)
	}

	/*
	 * Returns all the the keys in the dictionary.
	 */
	public keys(): IterableIterator<K> {
		return this.innerStorage.keys()
	}

	/*
	 * Returns the collection of values for the given key. Throws an error if the key does not exist
	 */
	public members(key: K): IterableIterator<V> {
		if (!this.innerStorage.has(key)) {
			throw new Error("key does not exist")
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.innerStorage.get(key)!.values()
	}

	/*
	 * Removes a member from a key.  If the last member is removed from the
	 * key, the key is removed from the dictdionary.  If the key or member does
	 * not exist, throws an error.
	 */
	public remove(key: K, value: V): void {
		this.checkForKey(key)
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const valueSet = this.innerStorage.get(key)!

		if (!valueSet.has(value)) {
			throw new Error("member does not exist")
		}
		valueSet.delete(value)

		if (valueSet.size === 0) {
			this.innerStorage.delete(key)
		}
	}

	/*
	 * Removes all members for a key and removes the key from the dictionary.
	 * Throws an error if the key does not exist.
	 */
	public removeAll(key: K): void {
		this.checkForKey(key)
		this.innerStorage.delete(key)
	}

	/*
	 * Removes all keys and all members from the dictionary
	 */
	public clear(): void {
		this.innerStorage.clear()
	}

	/*
	 * Returns whether a key exists or not
	 */
	public keyExists(key: K): boolean {
		return this.innerStorage.has(key)
	}

	/*
	 * Returns whether a member exists within a given key.  Returns false if
	 * the key does not exist.
	 */
	public memberExists(key: K, value: V): boolean {
		// NOTE: specification does not detail whether this method should throw
		// if key does not exist, but assuming that it should, for API
		// consistency
		this.checkForKey(key)

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.innerStorage.get(key)!.has(value)
	}

	/*
	 * Returns all the members in the dictionary
	 */
	public *allMembers(): IterableIterator<V> {
		for (const item of this.items()) {
			yield item[1]
		}
	}

	/*
	 * Returns all the items in the dictionary as key-value pairs
	 */
	public *items(): IterableIterator<[K, V]> {
		for (const [key, set] of this.innerStorage.entries()) {
			for (const member of set.values()) {
				yield [key, member]
			}
		}
	}

	/*
	 * Gets or creates the associated set from innerStorage for a given key
	 */
	private getOrCreateSetForKey(key: K): Set<V> {
		if (!this.innerStorage.has(key)) {
			this.innerStorage.set(key, new Set())
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.innerStorage.get(key)!
	}

	/*
	 * Gets the a set for a given key, and throws if it does not exist.
	 */
	private checkForKey(key: K): void {
		if (!this.innerStorage.has(key)) {
			throw new Error("key does not exist")
		}
	}
}
