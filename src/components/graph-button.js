class GraphButton extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <button class="text-2xl text-gray-300 px-12 mt-4 bg-cyan-800 hover:bg-cyan-700 rounded-xl">
        Add Node
    </button>
    `;
  }
  connectedCallback() {
    this.querySelector("button").textContent = this.getAttribute("label");
    this.querySelector("button").id = this.getAttribute("id");
  }
}
customElements.define("graph-button", GraphButton);
