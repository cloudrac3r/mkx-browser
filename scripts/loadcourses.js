const fs = require("fs")
const sqlite = require("better-sqlite3")

const db = new sqlite("main.db")
const file = fs.readFileSync("courselist.txt", "utf8")
const lines = file.split("\n")

const prepared = db.prepare("INSERT INTO Courses (cupID, position, name, customName) VALUES (?, ?, ?, NULL)")

let mode = "cupID"
let cupID = null
let pos = 0

for (let i = 0; i < lines.length; i++) {
	const line = lines[i].trim()
	if (!line) { // toggle mode on blank lines
		pos = 0
		if (mode === "cupID") mode = "course"
		else mode = "cupID"
	} else {
		if (mode === "cupID") { // cup mode
			cupID = Number(line)
		} else { // course mode
			prepared.run(cupID+1, pos, line)
			pos++
		}
	}
}
