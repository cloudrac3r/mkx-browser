const passthrough = require("./passthrough")

module.exports = {
	render: function(statusCode, filename, locals = undefined) {
		const page = passthrough.pugCache.get(filename)(locals)
		return {
			statusCode,
			contentType: "text/html",
			content: page
		}
	},
	redirect: function(url, statusCode = 303) {
		return {
			statusCode,
			contentType: "text/html",
			content: "Redirecting...",
			headers: {
				"Location": url
			}
		}
	}
}
