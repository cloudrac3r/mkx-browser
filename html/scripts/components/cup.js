/** @type {any[]} */
var ex = ex || []
ex.push({
	name: "cup",
	dependencies: ["basic", "settings-modal"],
	code: () => {
		const {SettingsModalInner} = require("./modals/settings")

		class Header extends ElemJS {
			/**
			 * @param {import("../store").Store} store
			 * @param {import("../../types").CupData} data
			 * @param {Cup} cup
			 */
			constructor(store, data, cup) {
				super("header")
				this.class("header")

				this.cup = cup

				this.child(
					new ElemJS("img").class("icon").direct("src", `/icons/${data.icon}-small.png`).direct("height", 128).direct("height", 128)
				).child(
					new ElemJS("h2").class("name").text(data.name)
				)

				this.element.addEventListener("click", this.onClick.bind(this))
			}

			onClick() {
				if (this.cup.element.classList.contains("hidden")) this.cup.show()
				else this.cup.hide()
			}
		}

		class Settings extends ElemJS {
			/**
			 * @param {import("../store").Store} store
			 * @param {Course} course
			 */
			constructor(store, course) {
				super("button")
				this.class("settings")
				this.text("Settings")
				this.muteEvent("click")

				this.course = course

				this.element.addEventListener("click", () => {
					let modal = new SettingsModalInner(store, course)
				})
			}
		}

		class Search extends ElemJS {
			/**
			 * @param {Course} course
			 */
			constructor(course) {
				super("a")
				this.class("search")
				this.text("Search Custom Track Wiki")
				this.muteEvent("click")
				let params = new URLSearchParams("title=Special%3ASearch&go=Go")
				params.append("search", course.data.name)
				this.attribute("href", "http://wiki.tockdom.com/w/index.php?"+params.toString())
				this.attribute("target", "_blank")
				this.attribute("rel", "noopener")
			}
		}

		class PlayedCheckbox extends ElemJS {
			/**
			 * @param {import("../tagstore").TagStore} tagStore
			 * @param {Course} course
			 */
			constructor(tagStore, course) {
				super("input")
				this.class("checkbox")
				this.attribute("type", "checkbox")
				this.muteEvent("click")

				this.tagStore = tagStore
				this.course = course

				this.tagList = this.tagStore.get(this.course.data.courseID)

				this.element.addEventListener("input", () => {
					// @ts-ignore
					this.tagList.set(playedTagID, this.element.checked)
					this.tagList.update()
				})

				this.tagStore.connectNow(this.course.data.courseID, this)
			}

			render() {
				// @ts-ignore
				this.element.checked = this.tagList.tagSet.has(playedTagID)
			}
		}

		class Course extends ElemJS {
			/**
			 * @param {import("../store").Store} store
			 * @param {import("../../types").CourseData} data
			 * @param {Cup} cup
			 */
			constructor(store, data, cup) {
				super("li")
				this.class("course")

				this.data = data
				this.store = store
				/** @type {import("../tagstore").TagStore} */
				this.tagStore = store.get("tagStore")
				this.tagList = this.tagStore.get(this.data.courseID)
				if (this.data.customNameIsCanon) {
					[this.data.name, this.data.customName] = [this.data.customName, this.data.name]
				}
				this.cup = cup
				this.matchName = this.data.name.toLowerCase()
				this.matchCustomName = this.data.customName ? this.data.customName.toLowerCase() : null
				this.matchResult = {tags: null, name: null, customName: null}

				this.child(
					new ElemJS("div").class("summary").child(
						new ElemJS("div").class("number").text(this.data.position+1)
					).child(
						new ElemJS("div").class("checkbox-container").child(new PlayedCheckbox(this.tagStore, this))
					).child(
						new ElemJS("div").class("name").text(this.data.name)
					)
				)

				let details = new ElemJS("div").class("details")
				let table = new ElemJS("div").class("table")
				if (this.data.customName) {
					table.child(new ElemJS("img").class("icon").attribute("src", this.data.customNameIsCanon ? "/icons/official.svg" : "/icons/speech.svg"))
					table.child(new ElemJS("div").text(this.data.customName))
				}
				this.tagListElement = new ElemJS("div")
				if (this.data.tags.length) {
					table.child(new ElemJS("img").class("icon").attribute("src", "/icons/tag.svg"))
					table.child(this.tagListElement)
					this.tagStore.connect(this.data.courseID, this)
				}
				table.child(new ElemJS("img").class("icon").attribute("src", "/icons/cog.svg"))
				table.child(new Settings(this.store, this))
				table.child(new ElemJS("img").class("icon").attribute("src", "/icons/search.svg"))
				table.child(new Search(this))

				details.child(table)
				this.child(details)

				this.element.addEventListener("click", this.onClick.bind(this))

				this.store.connectNow("filter", this)
			}

			shouldDisplay() {
				const {words, tags, invertTags} = this.store.get("filter")
				// do these first to ensure that all matchResults are available rather than short-circuiting
				// kinda janky but I'll take it
				this.testTags(tags, invertTags)
				this.testName(words)
				this.testCustomName(words)
				return this.matchResult.tags && (this.matchResult.name || this.matchResult.customName)
			}

			testTags(tags, invertTags) {
				let matchedTags = 0
				let status = this.tagList.tags.find(listTag => {
					if (invertTags.includes(listTag.text)) return true
					if (tags.includes(listTag.text)) matchedTags++
				})
				return this.matchResult.tags = (!status && matchedTags === tags.length)
			}

			testName(words) {
				return this.matchResult.name = words.every(w => this.matchName.includes(w))
			}

			testCustomName(words) {
				if (!this.matchCustomName) return this.matchResult.customName = false
				return this.matchResult.customName = words.every(w => this.matchCustomName.includes(w))
			}

			hide() {
				this.removeClass("focus")
				this.style("display", "none")
			}

			show() {
				this.style("display", "")
			}

			focus() {
				if (this.element.classList.contains("focus")) {
					this.unfocus()
				} else {
					this.cup.list.unfocusAll()
					this.class("focus")
				}
			}

			unfocus() {
				this.removeClass("focus")
			}

			onClick() {
				this.focus()
			}

			render() {
				if (this.shouldDisplay()) this.show()
				else this.hide()
				this.tagListElement.text(this.tagList.tags.map(tag => tag.text).join(", "))
			}
		}

		class Cup extends ElemJS {
			/**
			 * @param {import("../store").Store} store
			 * @param {import("./list").List} list
			 * @param {import("../../types").CupData} data
			 */
			constructor(store, list, data) {
				super("section")
				this.class("cup")

				this.store = store
				/** @type {import("../tagstore").TagStore} */
				this.tagStore = this.store.get("tagStore")
				this.list = list
				this.data = data

				this.courses = this.data.courses.map(data => new Course(this.store, data, this))

				this.parts = {
					header: new Header(this.store, this.data, this),
					courses: this.courses.reduce((a, c) => a.child(c), new ElemJS("ol").class("list"))
				}

				this.child(this.parts.header)
				this.child(this.parts.courses)

				this.tagStore.connectAll(this)
				this.store.connectNow("filter", this)
			}

			hide() {
				this.class("hidden")
				this.courses.forEach(course => course.unfocus())
			}

			show() {
				this.removeClass("hidden")
			}

			render() {
				if (!this.courses.some(c => c.shouldDisplay())) {
					this.style("display", "none")
				} else {
					this.style("display", "")
				}
			}
		}

		module.exports = {}
		module.exports.Cup = Cup
		module.exports.Course = Course
		return module.exports
	}
})
