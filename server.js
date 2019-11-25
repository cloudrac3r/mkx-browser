const pinski = require("pinski")
const sqlite = require("better-sqlite3")

const passthrough = require("./passthrough")

const db = new sqlite("main.db")

const server = pinski({
	httpPort: 10405,
	apiDir: "api",
	filesDir: "html",
	pugDir: "pug",
	sassDir: "sass",
	pugIncludeDirs: [],
	globalHeaders: {},
	pageHandlers: [
		{web: "/", local: "pug/index.pug", type: "pug"},
		{web: "/main.css", local: "sass/main.sass", type: "sass"}
	],
	relativeRoot: __dirname,
	ws: false
})

passthrough.db = db
Object.assign(passthrough, server)

server.loadAPI()
