/** @type {any[]} */
var ex = ex || []
ex.push({
	name: "list",
	dependencies: ["basic", "cup"],
	code: () => {
		const {Cup} = require("./cup")
		const {cupMasterList} = require("../../types")

		class List extends ElemJS {
			constructor(store) {
				super(q("#cups"))

				this.store = store

				/** @type {import("./cup").Cup[]} */
				this.cups = []
				this.buildCups()
			}

			hideAll() {
				this.cups.forEach(cup => cup.hide())
			}

			showAll() {
				this.cups.forEach(cup => cup.show())
			}

			toggleAll() {
				let someShown = this.cups.some(cup => !cup.element.classList.contains("hidden"))
				if (someShown) this.hideAll()
				else this.showAll()
			}

			unfocusAll() {
				this.cups.forEach(cup => {
					cup.courses.forEach(course => {
						course.unfocus()
					})
				})
			}

			selectRandom() {
				/** @type {import("./cup").Course[]} */
				let courses = [].concat(...this.cups.map(c => c.courses))
				courses = courses.filter(c => c.shouldDisplay())
				let target = random(courses)
				this.hideAll()
				target.cup.show()
				target.focus()
				target.element.scrollIntoView({behavior: "smooth", block: "center"})
			}

			buildCups() {
				cupMasterList.forEach(cupData => {
					const cup = new Cup(this.store, this, cupData)
					this.cups.push(cup)
					this.child(cup)
				})
			}
		}

		module.exports = {}
		module.exports.List = List
		return module.exports
	}
})
