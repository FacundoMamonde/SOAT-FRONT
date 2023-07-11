<template>
  <div>
    <button v-b-modal.modal-1 class="btn btn-primary btn-sm ms-2">
      <i class="bi bi-search"></i>
    </button>

    <b-modal
      id="modal-1"
      title="Clientes"
      @ok="submitForm"
      @cancel="hideForm"
      @hide="resetForm"
    >
      <div :style="{ display: showForm ? 'none' : 'flex' }" id="buscador">
        <b-form-input
          list="my-list-id"
          v-model="selectedClientName"
        ></b-form-input>

        <datalist id="my-list-id">
          <option>Manual Option</option>
          <option
            v-for="cliente in clientes"
            :key="cliente.id + cliente.name"
            :value="cliente.name"
          ></option>
        </datalist>
        <button @click="openForm" class="btn btn-success btn-sm ms-2">
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>

      <div v-if="showForm">
        <h5 class="mt-3">Agregar cliente</h5>
        <b-form>
          <b-form-group
            id="nameGroup"
            label="Nombre y apellido"
            label-for="nameInput"
          >
            <b-form-input id="nameInput" v-model="name" required></b-form-input>
          </b-form-group>

          <b-form-group id="phoneGroup" label="Teléfono" label-for="phoneInput">
            <b-form-input
              id="phoneInput"
              v-model="phone"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="descriptionGroup"
            label="Descripción"
            label-for="descriptionInput"
          >
            <b-form-textarea
              id="descriptionInput"
              v-model="description"
              required
            ></b-form-textarea>
          </b-form-group>
        </b-form>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "NewClientComponent",
  data() {
    return {
      clientes: [],
      showForm: false,
      name: "",
      phone: "",
      description: "",
      selectedClientName: "",
      selectedClientId: null,
    };
  },
  created() {
    fetch("http://localhost:3000/cliente")
      .then((response) => response.json())
      .then((clientes) => {
        this.clientes = clientes;
      })
      .catch((error) => {
        console.error("Error al obtener los clientes:", error);
      });
  },
  methods: {
    submitForm() {
      if (this.selectedClientName !== "") {
        const selectedClient = this.clientes.find(
          (cliente) => cliente.name == this.selectedClientName
        );
        this.selectedClientId = selectedClient.id;
        this.$emit("variable-enviada", this.selectedClientId);
      } else {
        if (this.name && this.phone && this.description) {
          this.showForm = false;
          const newClient = {
            name: this.name,
            phone: this.phone,
            info: this.description,
          };
          this.addClient(newClient);
        }
      }
    },
    addClient(client) {
      fetch("http://localhost:3000/cliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error al agregar el cliente");
          }
        })
        .then((response) => {
          this.selectedClientId = response.newID;
          this.$emit("variable-enviada", this.selectedClientId);
        })
        .catch((error) => {
          console.error("Error al agregar el cliente:", error);
        });
    },
    resetForm() {
      this.name = "";
      this.phone = "";
      this.description = "";
      this.showForm = false;
      this.selectedClientName = "";
      this.selectedClientId = null;
    },
    openForm() {
      this.name = "";
      this.selectedClientName = "";
      this.selectedClientId = null;
      this.showForm = true;
    },
    hideForm() {
      this.showForm = false;
    },
  },
};
</script>
<style></style>
