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

	/**
	 * @param {string} message
	 * @param {string} [type]
	 * @param {string} [method]
	 * @param {boolean} [isMessageHtml]
	 * @param {string} [confirmLabel]
	 * @param {string} [cancelLabel]
	 * @returns 
	 */
	static add() {
		if(defaultContainer)
			return defaultContainer.add.apply(defaultContainer, arguments);
		else
			throw new Error("No default ModalContainer found.");
	}

	/**
	 * @param {string} message
	 * @param {string} [type]
	 * @param {boolean} [isMessageHtml]
	 * @param {string} [confirmLabel]
	 * @param {string} [cancelLabel]
	 * @returns 
	 */
	static alert() {
		if(defaultContainer)
			return defaultContainer.alert.apply(defaultContainer, arguments);
		else
			throw new Error("No default ModalContainer found.");
	}

	/**
	 * @param {string} message
	 * @param {string} [type]
	 * @param {boolean} [isMessageHtml]
	 * @param {string} [confirmLabel]
	 * @param {string} [cancelLabel]
	 * @returns 
	 */
	static confirm() {
		if(defaultContainer)
			return defaultContainer.confirm.apply(defaultContainer, arguments);
		else
			throw new Error("No default ModalContainer found.");
	}

	/**
	 * @param {string} message
	 * @param {string} [type]
	 * @param {boolean} [isMessageHtml]
	 * @param {string} [confirmLabel]
	 * @param {string} [cancelLabel]
	 * @returns 
	 */
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
	 * @param {string} [confirmLabel=null] - label for confirm button
	 * @param {string} [cancelLabel=null] - label for cancel button
	 * @returns {Promise} promise that resolves or reject when dialog is closed with value
	 */
	add(message, type = null, method = null, isMessageHtml = false, confirmLabel = null, cancelLabel = null) {
		let msg = new NmdModal();
		if(isMessageHtml)
			msg.innerHTML = message;
		else
			msg.innerText = message;
		if(type)
			msg.setAttribute("type", type);
		if(method)
			msg.setAttribute("method", method);
		if(confirmLabel)
			msg.setAttribute("label-ok", confirmLabel);
		if(cancelLabel)
			msg.setAttribute("label-cancel", cancelLabel);
		for(let child of this.children){
			if(child instanceof NmdModal)
				child.close();
		}
		this.appendChild(msg);
		return msg.promise;
	}

	/**
	 * @param {string} message
	 * @param {string} [type]
	 * @param {boolean} [isMessageHtml]
	 * @param {string} [confirmLabel]
	 * @returns 
	 */
	alert(message, type, isMessageHtml, confirmLabel){
		return this.add(message, type, "alert", isMessageHtml, confirmLabel);
	}

	/**
	 * @param {string} message
	 * @param {string} [type]
	 * @param {boolean} [isMessageHtml]
	 * @param {string} [confirmLabel]
	 * @param {string} [cancelLabel]
	 * @returns 
	 */
	confirm(message, type, isMessageHtml, confirmLabel, cancelLabel){
		return this.add(message, type, "confirm", isMessageHtml, confirmLabel, cancelLabel);
	}

	/**
	 * @param {string} message
	 * @param {string} [type]
	 * @param {boolean} [isMessageHtml]
	 * @param {string} [confirmLabel]
	 * @param {string} [cancelLabel]
	 * @returns 
	 */
	prompt(message, type, isMessageHtml, confirmLabel, cancelLabel){
		return this.add(message, type, "prompt", isMessageHtml, confirmLabel, cancelLabel);
	}
}