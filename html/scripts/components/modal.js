/** @type {any[]} */
var ex = ex || []
ex.push({
	name: "modal",
	dependencies: ["basic"],
	code: () => {
		class ModalContainer extends ElemJS {
			constructor(container) {
				super(container)
			}

			addModal(modal) {
				document.body.classList.add("no-scrolling")
				this.child(modal)
				this.style("display", "block")
			}

			closeModals() {
				this.style("display", "none")
				document.body.classList.remove("no-scrolling")
				this.clearChildren()
			}
		}
		const modalContainer = new ModalContainer(q("#modal-container"))

		class CloseButton extends ElemJS {
			constructor() {
				super("button")
				this.class("close-button")
				this.addText("×")
				this.listeners = []
				this.element.addEventListener("click", () => {
					modalContainer.closeModals()
				})
			}
		}

		class Modal extends ElemJS {
			constructor(headText, body) {
				super("div")
				this.class("modal")

				const closeButton = new CloseButton()
				const head = new ElemJS("div")
				.class("head")
				.child(new ElemJS("h1").class("text").addText(headText))
				.child(closeButton)
				this.child(head)

				this.child(new ElemJS("div").class("body").child(body))

				modalContainer.addModal(this)
			}
		}

		module.exports = {}
		module.exports.Modal = Modal
		return module.exports
	}
})
