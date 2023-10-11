class TodoList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.taches = JSON.parse(localStorage.getItem("taches")) || [];
    this.render();
  }

  addTache() {
    const input = this.shadowRoot.querySelector("#newTache");
    const newTache = input.value.trim();
    if (newTache !== "") {
      this.taches.unshift({ text: newTache, completed: false });
      input.value = "";
      this.render();
      this.saveLocalStorage();
    }
  }

  clear() {
    this.taches = this.taches.filter((tache) => !tache.completed);
    this.render();
    this.saveLocalStorage();
  }

  toggleTache(index) {
    this.taches[index].completed = !this.taches[index].completed;
    this.render();
    this.saveLocalStorage();
  }

  editTache(index, newText) {
    this.taches[index].text = newText;
    this.render();
    this.saveLocalStorage();
  }

  deleteTache(index) {
    this.taches.splice(index, 1);
    this.render();
    this.saveLocalStorage();
  }

  saveLocalStorage() {
    localStorage.setItem("taches", JSON.stringify(this.taches));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ul {
          padding: 0;
          list-style: none;
          display: flex;
          align-items: stretch;
          flex-direction:column;
        }
        li div{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:1rem;
        }
        li:first-child{
          flex: 1;
        }
        li:last-child{
          flex: 0;
        }
        
        li {
          display: flex;
          padding: 1rem;
          margin:1rem;
          justify-content:space-between;
          background-color: #eaeaea;
          box-shadow: 10px 10px 30px 0px rgba(16, 16, 16, 0.15), -10px -10px 30px 0px #FFF;
          border-radius: 10px;
          border: 1px solid var(--light-gray, #DEDEDE);
          gap:0.5rem;
          
        }
        .edit-input{
          display:flex;
          width: 100%;
        }
        
        label{
          display:flex;
          align-items:center;
          justify-content:center;
          word-break: break-word;
          text-align:left;
        }
        label.checked {
          text-decoration: line-through;
          text-decoration-thickness: 2px;
        }
        
        button {
          background-color: var(--color-picked, #2b2b2b);
          border-radius:10px;
          color:  white;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
        }
        .add-tache{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:1rem;
        }
      </style>
      <div class="add-tache"><input id="newTache" type="text" placeholder="Nouvelle tâche" aria-label="Ajouter une nouvelle tâche"><button id="add-btn">Ajouter</button></div>
      <ul>
        ${this.taches
          .map(
            (tache, index) => `

          <li class="${tache.completed ? "completed" : ""}">
          <div> <input type="checkbox" id="tache-${index}" ${
              tache.completed ? "checked" : ""
            } aria-checked="${
              tache.completed
            }" aria-labelledby="label-tache-${index}">

            <label for="tache-${index}" id="label-tache-${index}" class="${
              tache.completed ? "checked" : ""
            }">${
              tache.text
            }</label>  <input type="text" class="edit-input" data-index="${index}" value="${
              tache.text
            }" style="display:none;"></div>

           
            
           
            <div>
            <button class="edit-btn" data-index="${index}" aria-label="Éditer la tâche" tabindex="0">✍️</button>
            <button class="delete-btn" data-index="${index}" aria-label="Supprimer la tâche" tabindex="0">🗑️</button>
            </div>
            
          </li>
        `
          )
          .join("")}
      </ul>
      <button id="clear-btn">Supprimer les tâches terminées</button>
    `;

    const checkboxes = this.shadowRoot.querySelectorAll(
      'input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox, index) => {
      checkbox.addEventListener("change", () => this.toggleTache(index));
    });

    const edit_buttons = this.shadowRoot.querySelectorAll(".edit-btn");
    edit_buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        const input = this.shadowRoot.querySelector(
          `.edit-input[data-index="${index}"]`
        );
        const label = this.shadowRoot.querySelector(`#label-tache-${index}`);
        label.style.display = "none";
        input.style.display = "block";
        input.focus();
        input.addEventListener("blur", () => {
          input.style.display = "none";
          label.style.display = "flex";
        });
        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter" || e.key === 13) {
            input.style.display = "none";
            label.style.display = "flex";
            this.editTache(index, input.value);
          }
        });
      });
    });

    const delete_buttons = this.shadowRoot.querySelectorAll(".delete-btn");
    delete_buttons.forEach((button, index) => {
      button.addEventListener("click", () => this.deleteTache(index));
    });
    this.shadowRoot
      .querySelector("#add-btn")
      .addEventListener("click", this.addTache.bind(this));
    this.shadowRoot
      .querySelector("#clear-btn")
      .addEventListener("click", this.clear.bind(this));
  }
}
customElements.define("did-dot", TodoList);
window.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("#color")
    .addEventListener("change", watchColorPicker, false);

  function watchColorPicker(event) {
    document.querySelector("*").style.color = event.target.value;
    localStorage.setItem("color", event.target.value);
    document
      .querySelector(":root")
      .style.setProperty("--color-picked", event.target.value);
  }
  if (localStorage.getItem("color")) {
    document
      .querySelector(":root")
      .style.setProperty("--color-picked", localStorage.getItem("color"));
    document.querySelector("*").style.color = localStorage.getItem("color");
  }
});
