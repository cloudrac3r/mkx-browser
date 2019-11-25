/** @type {any[]} */
var ex = ex || []
ex.push({
	name: "tag-store",
	dependencies: ["basic", "store"],
	code: () => {
		const {Store} = require("./store")
		const {cupMasterList, tagMasterList} = require("../types")

		class TagList {
			/**
			 * @param {TagStore} tagStore
			 * @param {number} courseID
			 * @param {import("../types").TagData[]} tags
			 */
			constructor(tagStore, courseID, tags) {
				this.tagStore = tagStore
				this.courseID = courseID
				/** @type {import("../types").TagData[]} */
				this.tags = tags

				this.tagSet = new Set()
				this.tags.forEach(tag => {
					this.tagSet.add(tag.tagID)
				})
			}

			set(tagID, status) {
				if (status) this.tagSet.add(tagID)
				else this.tagSet.delete(tagID)
			}

			update(noPost = false) {
				this.tags = [...this.tagSet.values()].map(id => tagMasterList.find(tag => tag.tagID === id))
				this.tagStore.update(this.courseID)
				if (!noPost) {
					fetch("/api/tags", {
						method: "POST",
						body: JSON.stringify({
							courseID: this.courseID,
							tagIDs: this.tags.map(tag => tag.tagID)
						})
					})
				}
			}
		}

		class TagStore extends Store {
			constructor() {
				super()

				cupMasterList.forEach(cup => {
					cup.courses.forEach(course => {
						let tagList = new TagList(this, course.courseID, course.tags)
						this.init(course.courseID, tagList)
					})
				})
			}

			clearPlayed() {
				for (const tagList of this.data.values()) {
					tagList.set(playedTagID, false)
					tagList.update(true)
				}
				fetch("/api/clearplayed", {
					method: "POST"
				})
			}
		}

		module.exports = {}
		module.exports.TagStore = TagStore
		return module.exports
	}
})
