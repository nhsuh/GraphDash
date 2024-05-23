class AddNodeForm extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = `
      <form id="node-form" >
      <div class="flex flex-col">
        <div class="p-2">
          <label for="node-name">Node Name:</label>
          <input
            class="bg-gray-200 rounded-xl text-cyan-800 pl-2"
            type="text"
            id="node-name"
            required
          />
        </div>
        <div class="p-2">
          <label for="node-x">X-Coordinate:</label>
          <input
            class="bg-gray-200 rounded-xl text-cyan-800 pl-2"
            type="number"
            id="node-x"
            required
          />
        </div>
        <div class="p-2">
          <label for="node-y">Y-Coordinate:</label>
          <input
            class="bg-gray-200 rounded-xl text-cyan-800 pl-2"
            type="number"
            id="node-y"
            required
          />
        </div>
        <div class="flex justify-center">
          <button
            type="submit"
            class="text-2xl text-gray-300 px-12 mt-4 bg-cyan-800 hover:bg-cyan-700 rounded-xl"
          >
            Add Node
          </button>
        </div>
        <div class="flex justify-center">
          <button
            id="cancel-nodes"
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
  customElements.define("add-node-form", AddNodeForm);
  