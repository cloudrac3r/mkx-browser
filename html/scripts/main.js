/** @type {any[]} */
var ex = ex || []
ex.push({
	name: "main",
	dependencies: ["basic", "search", "list", "store", "counter", "tag-store"],
	code: () => {
		const {Store} = require("./store")
		const {TagStore} = require("./tagstore")
		const {Search} = require("./components/search")
		const {List} = require("./components/list")
		const {Counter} = require("./components/counter")

		const store = new Store()
		store.init("filter", {words: [], tags: [], invertTags: []})

		const tagStore = new TagStore()
		store.set("tagStore", tagStore)

		const list = new List(store)
		new Search(store, list)
		new Counter(store, list)

		q("#toggle-all").addEventListener("click", () => list.toggleAll())
		q("#random").addEventListener("click", () => list.selectRandom())
		q("#mark-unplayed").addEventListener("click", () => tagStore.clearPlayed())
	}
})
