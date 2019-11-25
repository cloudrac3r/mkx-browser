/** @type {any[]} */
var ex = ex || []
ex.push({
	name: "store",
	dependencies: [],
	code: () => {
		class Store {
			constructor() {
				this.store = {}
				this.defaults = {
					"items-to-add-at-once": 1,
					"number-of-players": "Multiplayer",
					"list-choice": "Quick",
					"show-icons": true
				}
				this.listeners = []
				this.load()
			}

			load() {
				let item = localStorage.getItem("settings")
				if (item != null) {
					try {
						this.store = JSON.parse(item)
					} catch (e) {}
				}
			}

			save() {
				localStorage.setItem("settings", JSON.stringify(this.store))
			}

			get(property) {
				let result = this.store[property]
				if (result !== undefined) return result
				else return this.defaults[property]
			}

			set(property, value) {
				this.store[property] = value
				this.update(property)
			}

			update(property) {
				this.listeners.forEach(listener => {
					if (listener.property === property) listener.update(this.get(property))
				})
				this.save()
			}

			connect(property, update) {
				this.listeners.push({property, update})
			}

			connectNow(property, update) {
				this.connect(property, update)
				this.update(property)
			}
		}

		return module.exports = {
			Store
		}
	}
})
