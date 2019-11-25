/** @type {any[]} */
var ex = ex || []
ex.push({
	name: "basic",
	dependencies: []
})

/** @returns {HTMLElement} */
const q = s => document.querySelector(s)

class ElemJS {
	constructor(type) {
		if (type instanceof HTMLElement) this.bind(type)
		else this.bind(document.createElement(type))
		this.children = [];
	}
	bind(element) {
		/** @type {HTMLElement} */
		this.element = element
		// @ts-ignore
		this.element.js = this
		return this
	}
	class() {
		for (let name of arguments) if (name) this.element.classList.add(name);
		return this;
	}
	removeClass() {
		for (let name of arguments) if (name) this.element.classList.remove(name);
		return this;
	}
	direct(name, value) {
		if (name) this.element[name] = value;
		return this;
	}
	attribute(name, value) {
		if (name) this.element.setAttribute(name, value);
		return this;
	}
	style(name, value) {
		if (name) this.element.style[name] = value;
		return this;
	}
	id(name) {
		if (name) this.element.id = name;
		return this;
	}
	text(name) {
		this.element.innerText = name;
		return this;
	}
	addText(name) {
		const node = document.createTextNode(name)
		this.element.appendChild(node)
		return this
	}
	html(name) {
		this.element.innerHTML = name;
		return this;
	}
	child(toAdd, position) {
		if (typeof(toAdd) == "object") {
			toAdd.parent = this;
			if (typeof(position) == "number" && position >= 0) {
				this.element.insertBefore(toAdd.element, this.element.children[position]);
				this.children.splice(position, 0, toAdd);
			} else {
				this.element.appendChild(toAdd.element);
				this.children.push(toAdd);
			}
		} else if (typeof toAdd === "string") {
			this.text(toAdd)
		}
		return this;
	}
	clearChildren() {
		this.children.length = 0;
		while (this.element.lastChild) this.element.removeChild(this.element.lastChild);
	}
	muteEvent(eventName) {
		this.element.addEventListener(eventName, event => event.stopPropagation())
		return this
	}
}

/** @param {any[]} array */
function randomIndex(array) {
	return Math.floor(Math.random()*array.length)
}

/**
 * @param {T[]} array
 * @returns {T}
 * @template T
 */
function random(array) {
	return array[randomIndex(array)]
}

function plural(count, thing) {
	if (count === 1) return `${count} ${thing}`
	let ext =
		thing.endsWith("s") ? "es" :
		thing.endsWith("x") ? "es" :
		"s"
	return `${count} ${thing}${ext}`
}

const playedTagID = 20
