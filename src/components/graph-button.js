class GraphButton extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <button
    id="add-node"
    class="text-2xl text-gray-300 px-12 mt-4 bg-cyan-800 hover:bg-cyan-700 rounded-xl"
  >
    Add Node
  </button>
        
    `;
  }
  connectedCallback() {}
}
customElements.define("graph-button", GraphButton);
