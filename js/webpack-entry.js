import NmdModal from "./nmd-modal";
import NmdModalContainer from "./nmd-modal-container";
import "../scss/main.scss";

window.NmdModal = NmdModal;
window.NmdModalContainer = NmdModalContainer;
customElements.define("nmd-modal", NmdModal);
customElements.define("nmd-modal-container", NmdModalContainer);