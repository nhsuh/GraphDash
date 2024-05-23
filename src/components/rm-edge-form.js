class RmEdgeForm extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = `
      <form >
      <div class="flex flex-col">
        <div class="p-2">
          <label for="rm-from-node">From:</label>
          <input
            class="bg-gray-200 rounded-xl text-cyan-800 pl-2"
            type="text"
            id="rm-from-node"
            required
          />
        </div>
        <div class="p-2">
          <label for="rm-to-node">To:</label>
          <input
            class="bg-gray-200 rounded-xl text-cyan-800 pl-2"
            type="text"
            id="rm-to-node"
            required
          />
        </div>
        <div class="flex justify-center">
          <button
            type="submit"
            class="text-2xl text-gray-300 px-12 mt-4 bg-cyan-800 hover:bg-cyan-700 rounded-xl"
          >
            Remove Edge
          </button>
        </div>
        <div class="flex justify-center">
          <button
            id="cancel-rm-edges"
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
  customElements.define("rm-edge-form", RmEdgeForm);