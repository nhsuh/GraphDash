class BFSForm extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = `
      <form>
      <div class="p-2">
        <label for="bfs-start">Node Name:</label>
        <input
          class="bg-gray-200 rounded-xl text-cyan-800 pl-2"
          type="text"
          id="bfs-start"
          required
        />
      </div>
      <div class="flex justify-center">
        <button
          type="submit"
          class="text-2xl text-gray-300 px-12 mt-4 bg-cyan-800 hover:bg-cyan-700 rounded-xl"
        >
          Start
        </button>
      </div>
      <div class="flex justify-center">
        <button
          id="cancel-bfs"
          type="cancel"
          class="text-2xl text-gray-300 px-12 mt-4 bg-amber-700 hover:bg-amber-800 rounded-xl"
        >
          Cancel
        </button>
      </div>
    </form>
      `;
    }
  }
  customElements.define("bfs-form", BFSForm);
  