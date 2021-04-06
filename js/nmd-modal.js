import HTMLParsedElement from 'html-parsed-element';
import NmdModalContainer from './nmd-modal-container';

const msgTemplate = document.createRange().createContextualFragment(/*html*/`
<div data-nmd-message><slot></slot></div>
<div data-nmd-buttons></div>
`);

export default class NmdModal extends HTMLParsedElement {
	static add() {
		return NmdModalContainer.add.apply(null, arguments);
	}

	static alert() {
		return NmdModalContainer.alert.apply(null, arguments);
	}

	static confirm() {
		return NmdModalContainer.confirm.apply(null, arguments);
	}

	static prompt() {
		return NmdModalContainer.prompt.apply(null, arguments);
	}

	constructor() {
		super();

		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

	static get observedAttributes() {
		return [];
	}

	attributeChangedCallback(name, oldValue, newValue) {
	}

	parsedCallback() {
		let fragment = msgTemplate.cloneNode(true);
		let contentElement = fragment.querySelector("slot");
		while (this.childNodes.length > 0) {
			contentElement.parentNode.appendChild(this.childNodes[0]);
		}
		contentElement.remove();
		this.appendChild(fragment);

		this._messageElement = this.querySelector("[data-nmd-message]");
		this._buttonsElement = this.querySelector("[data-nmd-buttons]");

		if(this.getAttribute("method") === "prompt" && !this.querySelector("input,select,textarea")){
			// Is prompt and no input specified
			this._messageElement.append(document.createElement("INPUT"));
		}

		this.makeButtons();

		let container = this.closest("nmd-modal-container");
		if(container)
			container.hidden = false;
	}

	makeButtons(){
		switch(this.getAttribute("method")){
			case "prompt":
				this._buttonsElement.innerHTML = /*html*/`
					<button data-nmd-resolve="null">${this.getCancelLabel()}</button>
					<button data-nmd-resolve-input="input,select,textarea">${this.getConfirmLabel()}</button>`;
				break;
			case "confirm":
				this._buttonsElement.innerHTML = /*html*/`
					<button data-nmd-resolve="false">${this.getCancelLabel()}</button>
					<button data-nmd-resolve="true">${this.getConfirmLabel()}</button>`;
				break;
			case "alert":
			default:
				this._buttonsElement.innerHTML = /*html*/`
					<button data-nmd-resolve="true">${this.getConfirmLabel()}</button>`;
				break;
		}
		for(let resolveBtn of this.querySelectorAll("button[data-nmd-resolve]")){
			resolveBtn.addEventListener("click", (e) => {
				this.resolve(JSON.parse(e.target.getAttribute("data-nmd-resolve")));
				this.close();
			});
		}
		for(let rejectBtn of this.querySelectorAll("button[data-nmd-reject]")){
			rejectBtn.addEventListener("click", (e) => {
				this.reject(JSON.parse(e.target.getAttribute("data-nmd-reject")));
				this.close();
			});
		}
		for(let resolveBtn of this.querySelectorAll("button[data-nmd-resolve-input]")){
			resolveBtn.addEventListener("click", (e) => {
				this.resolve(this.querySelector(e.target.getAttribute("data-nmd-resolve-input")).value);
				this.close();
			});
		}
	}

	close(){
		let container = this.closest("nmd-modal-container");
		if(container)
			container.hidden = true;
		
		this.reject(new Error("Modal was closed"));
		this.remove();
	}

	getCancelLabel(){
		let container = this.closest("nmd-modal-container");
		return this.getAttribute("label-cancel") || (container && container.getAttribute("label-cancel")) || "Cancel";
	}

	getConfirmLabel(){
		let container = this.closest("nmd-modal-container");
		return this.getAttribute("label-ok") || (container && container.getAttribute("label-ok")) || "OK";
	}

	/**
	 * @returns {string} type of message.
	 */
	get type() {
		return this.getAttribute("type") || "info";
	}

	/**
	 * Set type of message. Can be any string but css styles are prepared for types: "info", 
	 * "success", "fail" and "warning". "info" is default.
	 * @param {string} value
	 */
	set type(value) {
		this.setAttribute("type", value);
	}

	/**
	 * @returns {string} text of message without HTML tags.
	 */
	get messageText() {
		if (this._messageElement)
			return this._messageElement.innerText;
		return null;
	}

	get messageElement() {
		return this._messageElement;
	}

	set messageText(text) {
		if (this._messageElement)
			this._messageElement.innerText = text;
	}
}