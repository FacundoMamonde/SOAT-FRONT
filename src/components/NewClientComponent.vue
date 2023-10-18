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
          placeholder="Selecciona un cliente"
        ></b-form-input>

        <datalist id="my-list-id">
          
          <option
            v-for="cliente in clientes"
            :key="cliente.id + cliente.nombre"
            :value="cliente.nombre"
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
            <b-form-input id="nameInput" v-model="nombre" required></b-form-input>
          </b-form-group>

          <b-form-group id="phoneGroup" label="Teléfono" label-for="phoneInput">
            <b-form-input
              id="phoneInput"
              v-model="telefono"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="dniGroup" label="dni" label-for="dniInput">
            <b-form-input
              id="dniInput"
              v-model="dni"
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
import { backendData} from "../main";
export default {
  name: "NewClientComponent",
  data() {
    return {
      clientes: [],
      showForm: false,
      nombre: "",
      telefono: "",
      dni: "",
      description:"",
      selectedClientName: "",
      selectedClientId: null,
    };
  },
  created() {
    fetch(`${backendData}/cliente`)
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
          (cliente) => cliente.nombre == this.selectedClientName
        );
        this.selectedClientId = selectedClient.id;
        this.$emit("cliente-agregado", this.selectedClientId);
      } else {
        if (this.nombre && this.telefono && this.dni && this.description) {
          this.showForm = false;
          const createClientDto = {
            nombre: this.nombre,
            telefono: this.telefono,
            dni: this.dni,
            descripcion:this.description
          };
          this.addClient(createClientDto);
        }
      }
    },
    addClient(client) {
      fetch(`${backendData}/cliente`, {
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
          this.selectedClientId = response.id;
          this.$emit("cliente-agregado", this.selectedClientId);
        })
        .catch((error) => {
          console.error("Error al agregar el cliente:", error);
        });
    },
    resetForm() {
      this.nombre= "";
      this.telefono = "";
      this.dni = "";
      this.description=""
      this.showForm = false;
      this.selectedClientName = "";
      this.selectedClientId = null;
    },
    openForm() {
      this.nombre = "";
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
