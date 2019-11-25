/** @type {any[]} */
var ex = ex || []
ex.push({
	name: "search",
	dependencies: ["basic"],
	code: () => {
		class Search extends ElemJS {
			/**
			 * @param {import("../store").Store} store
			 * @param {import("./list").List} list
			 */
			constructor(store, list) {
				super(q("#search-box"))

				/** @type {HTMLInputElement} */
				this.element

				this.store = store
				this.list = list

				this.element.addEventListener("input", this.onInput.bind(this))
				this.onInput()
			}

			onInput() {
				const search = this.element.value
				const words = []
				const tags = []
				const invertTags = []
				search.toLowerCase().split(" ").forEach(item => {
					if (item.startsWith(".")) tags.push(item.slice(1))
					else if (item.startsWith("-")) invertTags.push(item.slice(1))
					else words.push(item)
				})
				this.store.set("filter", {words, tags, invertTags})
			}
		}

		module.exports = {}
		module.exports.Search = Search
		return module.exports
	}
})
