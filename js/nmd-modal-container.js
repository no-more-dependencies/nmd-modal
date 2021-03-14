import NmdModal from "./nmd-modal";

let defaultContainer = null;

export default class NmdModalContainer extends HTMLElement {
	static set defaultContainer(container){
		if(container instanceof ModalContainer)
			defaultContainer = container;
		else
			throw new Error("Passed element is not ModalContainer.");
	}

	static get defaultContainer() {
		return defaultContainer;
	}

	static add() {
		if(defaultContainer)
			return defaultContainer.add.apply(defaultContainer, arguments);
		else
			throw new Error("No default ModalContainer found.");
	}

	static alert() {
		if(defaultContainer)
			return defaultContainer.alert.apply(defaultContainer, arguments);
		else
			throw new Error("No default ModalContainer found.");
	}

	static confirm() {
		if(defaultContainer)
			return defaultContainer.confirm.apply(defaultContainer, arguments);
		else
			throw new Error("No default ModalContainer found.");
	}

	static prompt() {
		if(defaultContainer)
			return defaultContainer.prompt.apply(defaultContainer, arguments);
		else
			throw new Error("No default ModalContainer found.");
	}

	constructor() {
		super();
		if(!defaultContainer)
			defaultContainer = this;
	}

	/**
	 * Creates new modal dialog and appends it to this container.
	 * @param {string} message -  text of message, if this contains HTML tags, also set isMessage to true
	 * @param {string} [type=null] - message type
	 * @param {string} [method=null] - dialog method
	 * @param {boolean} [isMessageHtml=false] - set this to true if message contains HTML tags
	 * @returns {Promise} promise that resolves or reject when dialog is closed with value
	 */
	add(message, type, method, isMessageHtml) {
		let msg = new NmdModal();
		if(isMessageHtml)
			msg.innerHTML = message;
		else
			msg.innerText = message;
		if(type)
			msg.setAttribute("type", type);
		if(method)
			msg.setAttribute("method", method);
		for(let child of this.children){
			if(child instanceof NmdModal)
				child.close();
		}
		this.appendChild(msg);
		return msg.promise;
	}

	alert(message, type, isMessageHtml){
		return this.add(message, type, "alert", isMessageHtml);
	}

	confirm(message, type, isMessageHtml){
		return this.add(message, type, "confirm", isMessageHtml);
	}

	prompt(message, type, isMessageHtml){
		return this.add(message, type, "prompt", isMessageHtml);
	}
}