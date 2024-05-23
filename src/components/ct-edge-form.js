class CtEdgeForm extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = `
      <form id="ct-edge-form" style="display: none">
      <div class="flex flex-col">
        <div class="p-2">
          <label for="ct-edge-1">From Node:</label>
          <input
            class="bg-gray-200 rounded-xl text-cyan-800 pl-2"
            type="text"
            id="ct-edge-1"
            required
          />
        </div>
        <div class="p-2">
          <label for="ct-edge-2">To Node:</label>
          <input
            class="bg-gray-200 rounded-xl text-cyan-800 pl-2"
            type="text"
            id="ct-edge-2"
            required
          />
        </div>
        <div class="p-2">
          <label for="ct-node-name">New Node Name:</label>
          <input
            class="bg-gray-200 rounded-xl text-cyan-800 pl-2"
            type="text"
            id="ct-node-name"
            required
          />
        </div>
        <div class="flex justify-center">
          <button
            type="submit"
            class="text-2xl text-gray-300 px-12 mt-4 bg-cyan-800 hover:bg-cyan-700 rounded-xl"
          >
            Contract
          </button>
        </div>
        <div class="flex justify-center">
          <button
            id="cancel-ct-edge"
            type="cancel"
            class="text-2xl text-gray-300 px-12 mt-4 bg-amber-700 hover:bg-amber-800 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
      `;
    }
  }
  customElements.define("ct-edge-form", CtEdgeForm);