/** @type {any[]} */
var ex = ex || []
ex.push({
	name: "styled-components",
	dependencies: ["basic"],
	code: () => {
		class Radio extends ElemJS {
			constructor(settings, name, options) {
				super("div")
				this.name = name
				this.options = options
				this.settings = settings

				this.state = this.settings.get(name)
				this.listeners = []

				this.class("styled-radio")
				this.render()
			}

			render() {
				this.clearChildren()
				this.labels = []

				this.options.forEach(option => {
					const label = new ElemJS("label")

					const input = new ElemJS("input")
					.attribute("type", "radio")
					.attribute("name", this.name)
					if (this.state === option) {
						input.element.checked = true
						label.class("checked")
					}
					input.element.addEventListener("input", () => {
						this.updateState(option)
					})

					label.addText(option)
					label.child(input)

					this.child(label)
					this.labels.push(label)
				})
			}

			addListener(callback) {
				this.listeners.push(callback)
			}

			updateState(value) {
				this.state = value
				this.listeners.forEach(cb => cb(this.state))
				this.labels.forEach(label => {
					if (label.children[0].element.checked) label.class("checked")
					else label.removeClass("checked")
				})
				this.settings.set(this.name, value)
			}

			getState() {
				return this.state
			}
		}

		class Input extends ElemJS {
			constructor(settings, id, labelText, width) {
				super("div")
				this.id = id
				this.labelText = labelText
				this.width = width
				this.settings = settings

				this.state = this.settings.get(id)
				this.listeners = []

				this.class("styled-input")
				this.render()
			}

			render() {
				this.clearChildren()
				this.child(new ElemJS("label").attribute("for", this.id).addText(this.labelText))

				const input = new ElemJS("input")
				.id(this.id)
				if (this.width) input.attribute("style", `width: ${this.width}px`)
				input.element.value = this.state
				input.element.addEventListener("input", () => {
					this.settings.set(this.id, input.element.value)
				})
				this.child(input)
			}
		}

		class Checkbox extends ElemJS {
			constructor(settings, name, labelText) {
				super("div")
				this.name = name
				this.labelText = labelText
				this.settings = settings

				this.state = this.settings.get(this.name)

				this.class("styled-checkbox")
				this.render()
			}

			render() {
				this.clearChildren()

				const label = new ElemJS("label")
				.attribute("for", this.name)
				.addText(this.labelText)

				const input = new ElemJS("input")
				.attribute("type", "checkbox")
				.attribute("name", this.name)
				.attribute("id", this.name)
				if (this.state) {
					input.element.checked = true
					label.class("checked")
				}
				input.element.addEventListener("input", () => {
					this.settings.set(this.name, input.element.checked)
				})

				this.child(label)
				this.child(input)
			}
		}

		return module.exports = {
			Radio,
			Input,
			Checkbox
		}
	}
})
