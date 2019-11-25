/** @type {any[]} */
var ex = ex || []
ex.push({
	name: "counter",
	dependencies: ["basic", "store"],
	code: () => {
		class Counter extends ElemJS {
			/**
			 * @param {import("../store").Store} store
			 * @param {import("./list").List} list
			 */
			constructor(store, list) {
				super(q("#display-count"))

				this.list = list

				const tagStore = store.get("tagStore")
				tagStore.connectAll(this)

				store.connectNow("filter", this)
			}

			render() {
				let count = 0
				this.list.cups.forEach(cup => {
					cup.courses.forEach(course => {
						if (course.shouldDisplay()) count++
					})
				})
				this.text(plural(count, "course"))
			}
		}

		module.exports = {}
		module.exports.Counter = Counter
		return module.exports
	}
})
