# mkx-browser

Browse, tag, and search Mario Kart Wii custom tracks.

This is designed for [Mario Kart X](http://wiki.tockdom.com/wiki/Mario_Kart_X) version 2.0, but can be used with any custom track distribution.

# Screenshots

![A list of cups and courses. "mushr" is typed in the search box. It found 5 courses. The visible cups are the Mushroom Cup, containing Mushroom Fort, the Leaf Cup, containing Desert Mushroom Ruins and GCN Mushroom City, and the Thundercloud Cup, containing Kinoko Cave.](https://cadence.moe/api/images/8cc050)

![A list of tags with checkboxes next to them. "retro" and "fav" are checked. There are many unchecked tags, including "mushrooms", "original", "night", "bad", and "rainbow".](https://cadence.moe/api/images/28183c)

# Installation

1. `git clone` this project
1. `npm install`
1. create `/main.db` using data from the `/dumps` folder
1. start the server with `node index.js`
1. visit http://localhost:10405

# Usage

- Write in the search box to filter courses by their name or customName
- Write `.` before a word to only show courses with that tag
- Write `-` before a word to only show courses without that tag
- Click a cup name to collapse or expand it
- Click a course name to show more information about it
- Click course settings to change which tags it has (edits are synced to the server)
- Click the box next to a course to add or remove its "played" tag — combine this with searching for `-played`, and never repeat the same tracks in a session!

# Code

- language: [node.js](https://nodejs.org)
- webserver: [pinski](https://github.com/cloudrac3r/pinski) (my own)
- storage: [SQLite](https://sqlite.org/)
- sqlite library: [better-sqlite3](https://www.npmjs.com/package/better-sqlite3)
- html templating: [pug](https://pugjs.org/)
- css processing: [sass](https://sass-lang.com/)
- components: elemjs (my own)
- data store: store (my own)
