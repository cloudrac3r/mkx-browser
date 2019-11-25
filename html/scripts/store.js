/** @type {any[]} */
var ex = ex || []
ex.push({
	name: "store",
	dependencies: [],
	code: () => {
		class Store {
			constructor() {
				this.data = new Map()
				this.connections = []
				this.globalConnections = []
			}

			get(name) {
				return this.data.get(name)
			}

			set(name, value) {
				this.data.set(name, value)
				this.update(name)
			}

			init(name, value) {
				if (!this.data.has(name)) {
					this.set(name, value)
				}
			}

			update(name) {
				this.connections.forEach(connection => {
					if (connection.name === name) {
						this.updateComponent(connection.name, connection.component)
					}
				})
				this.globalConnections.forEach(component => {
					this.updateComponent(name, component)
				})
			}

			updateComponent(name, component) {
				component.render(this.get(name))
			}

			connect(name, component) {
				this.connections.push({name, component})
			}

			connectNow(name, component) {
				this.connect(name, component)
				this.updateComponent(name, component)
			}

			connectAll(component) {
				this.globalConnections.push(component)
			}
		}

		module.exports = {}
		module.exports.Store = Store
		return module.exports
	}
})
