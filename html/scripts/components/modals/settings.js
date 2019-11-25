/** @type {any[]} */
var ex = ex || []
ex.push({
	name: "settings-modal",
	dependencies: ["basic", "modal"],
	code: () => {
		const {Modal} = require("../modal")
		const {tagMasterList} = require("../../../types")

		class Tag extends ElemJS {
			/**
			 * @param {import("../../tagstore").TagStore} tagStore
			 * @param {import("../cup").Course} course
			 * @param {import("../../../types").TagData} tag
			 */
			constructor(tagStore, course, tag) {
				super("li")
				this.class("tag")

				this.course = course
				this.tagStore = tagStore
				this.tagList = this.tagStore.get(this.course.data.courseID)
				this.tag = tag

				let id = `modal-tag-${this.course.data.courseID}-${this.tag.tagID}`
				this.checkbox = new ElemJS("input").attribute("type", "checkbox").class("checkbox").id(id)
				this.checkbox.element
				this.child(this.checkbox)
				this.child(new ElemJS("label").class("label").text(tag.text).attribute("for", id))

				this.checkbox.element.addEventListener("input", () => {
					// @ts-ignore
					this.tagList.set(this.tag.tagID, this.checkbox.element.checked)
					this.tagList.update()
				})

				this.tagStore.connectNow(course.data.courseID, this)
			}

			render() {
				this.checkbox.direct("checked", this.tagList.tagSet.has(this.tag.tagID))
			}
		}

		class SettingsModalInner extends ElemJS {
			/**
			 * @param {import("../../store").Store} store
			 * @param {import("../cup").Course} course
			 */
			constructor(store, course) {
				super("div")
				this.class("settings-modal-inner")

				let modal = new Modal("Settings", this)

				this.store = store
				/** @type {import("../../tagstore").TagStore} */
				this.tagStore = store.get("tagStore")
				this.course = course

				this.child(new ElemJS("h2").text("Tags"))

				let list = new ElemJS("ol").class("tag-list")
				tagMasterList.forEach(tag => {
					list.child(new Tag(this.tagStore, course, tag))
				})
				this.child(list)
			}
		}

		module.exports = {}
		module.exports.SettingsModalInner = SettingsModalInner
		return module.exports
	}
})
