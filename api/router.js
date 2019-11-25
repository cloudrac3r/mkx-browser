const {db} = require("../passthrough")
const {render} = require("../utils")

module.exports = [
	{
		route: "/", methods: ["GET"], code: async () => {
			const cups = db.prepare("SELECT cupID, name, icon FROM Cups ORDER BY cupID ASC").all()
			const courses = db.prepare("SELECT Courses.courseID, Courses.cupID, Courses.position, Courses.name, Courses.customName, Courses.customNameIsCanon FROM Courses INNER JOIN Cups USING (cupID)").all()
			const tags = db.prepare("SELECT tagID, text FROM Tags").all()
			const courseTags = db.prepare("SELECT CourseTags.tagID, CourseTags.courseID, Tags.text FROM CourseTags INNER JOIN Tags USING (tagID)").all()
			courses.forEach(course => course.tags = [])
			cups.forEach(cup => {
				cup.courses = courses.filter(co => co.cupID === cup.cupID)
			})
			courses.forEach(course => {
				course.tags = courseTags.filter(ct => ct.courseID === course.courseID)
			})
			return render(200, "pug/index.pug", {cupMasterList: cups, tagMasterList: tags})
		}
	}
]
