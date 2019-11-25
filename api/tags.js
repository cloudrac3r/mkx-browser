const passthrough = require("../passthrough")

const playedTagID = 20

module.exports = [
	{
		route: "/api/tags", methods: ["POST"], code: async ({data}) => {
			console.log(data)
			if (!data) return [400, "Bad POST data"]
			if (typeof data.courseID !== "number") return [400, ".courseID must be number"]
			if (!Array.isArray(data.tagIDs)) return [400, ".tagIDs must be array"]
			if (!data.tagIDs.every(element => typeof element === "number")) return [400, ".tagIDs must be array of number"]

			// Clear existing tags
			passthrough.db.prepare("DELETE FROM CourseTags WHERE courseID = ?").run(data.courseID)

			// Add new tags
			if (data.tagIDs.length) {
				let prepared = []
				data.tagIDs.forEach(tagID => {
					prepared.push(data.courseID, tagID)
				})
				passthrough.db.prepare(
					"INSERT INTO CourseTags (courseID, tagID) VALUES "
					+Array(data.tagIDs.length).fill("(?, ?)").join(", ")
				).run(prepared)

				return [204, ""]
			}
		}
	},
	{
		route: "/api/clearplayed", methods: ["POST"], code: async () => {
			passthrough.db.prepare("DELETE FROM CourseTags WHERE tagID = ?").run(playedTagID)
			return [204, ""]
		}
	}
]
