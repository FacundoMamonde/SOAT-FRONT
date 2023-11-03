<template>
  <div>
    <b-button v-b-modal.modal-cliente variant="primary" class="btn btn-sm ms-2"
      ><i class="bi bi-search"></i
    ></b-button>
    <b-modal
      id="modal-cliente"
      ref="modal"
      :title="this.titleModal()"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <div :style="{ display: showForm ? 'none' : 'flex' }" id="buscador">
        <!-- <b-form-input
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
        </datalist> -->
        <div class="mx-auto w-100">
          <div class="d-flex m-auto col-10">
            <b-input-group>
              <span class="input-group-text" id="basic-addon1"
                ><b-icon-search></b-icon-search
              ></span>
              <b-form-input
                v-model="searchQuery"
                size="sm"
                placeholder="Buscar por nombre o telefono"
              />
            </b-input-group>
            <button @click="openAddClient" class="btn btn-success btn-sm ms-2">
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
          <div
            class="d-flex d-column center justify-content-center mx-auto w-100"
          >
            <b-table
              w-100
              id="searchClient"
              :per-page="perPage"
              :current-page="currentPage"
              striped
              hover
              :items="filteredClientes()"
              :fields="fields"
              label-sort-asc=""
              label-sort-desc=""
              label-sort-clear=""
            ></b-table>
          </div>
          <div class="d-flex justify-content-center">
            <b-pagination
              size="sm"
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              aria-controls="searchClient"
            ></b-pagination>
          </div>
        </div>
      </div>
      <p v-if="selectionError" class="text-danger">
        {{ errorText }}
      </p>
      <div v-if="showForm">
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            label="Nombre y apellido(*)"
            label-for="name-input"
            invalid-feedback="El nombre es requerido"
            :state="nameState"
          >
            <b-form-input
              id="name-input"
              v-model="nombre"
              :state="nameState"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Telefono (*)"
            label-for="phone-input"
            invalid-feedback="El telefono es requerido"
            :state="phoneState"
            ref="phoneInput"
          >
            <b-form-input
              id="phone-input"
              v-model="telefono"
              :state="phoneState"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group id="dniGroup" label="Dni" label-for="dniInput">
            <b-form-input id="dniInput" v-model="dni" required></b-form-input>
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
          <b-button
            @click="returnModal"
            size="sm"
            variant="primary"
            class="my-3"
          >
            <b-icon icon="arrow-left" aria-label="return"></b-icon>
          </b-button>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { backendData } from "../main";
export default {
  data() {
    return {
      totalRows: null,
      currentPage: 1,
      perPage: 10,
      nameState: null,
      phoneState: null,
      clientes: [],
      showForm: false,
      nombre: "",
      telefono: "",
      dni: null,
      description: null,
      selectedClientName: "",
      selectedClientId: null,
      selectionError: false,
      errorText: "",
      searchQuery: "",
      fields: [
        { key: "nombre", label: "Nombre", sortable: true },
        { key: "telefono", label: "Telefono", sortable: true },
      ],
    };
  },
  created() {
    this.getAllClients();
  },
  methods: {
    filteredClientes() {
      if (this.searchQuery.trim() === "") {
        return this.clientes;
      }

      return this.clientes.filter((cliente) => {
        return (
          cliente.nombre
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          cliente.telefono.includes(this.searchQuery)
          // Add more fields to search if needed
        );
      });
    },
    openAddClient() {
      this.showForm = true;
      this.selectionError = false;
    },
    returnModal() {
      this.showForm = false;
      this.resetModal();
    },
    titleModal() {
      if (this.showForm) {
        return "Agregar cliente";
      } else {
        return "Seleccionar cliente";
      }
    },
    getAllClients() {
      fetch(`${backendData}/cliente`)
        .then((response) => response.json())
        .then((clientes) => {
          this.clientes = clientes;
          this.totalRows = this.clientes.length;
        })
        .catch((error) => {
          console.error("Error al obtener los clientes:", error);
        });
    },
    // changeModal() {
    //   this.showForm = !this.showForm

    // },
    // openForm() {
    //   this.nombre = "";
    //   this.selectedClientName = "";
    //   this.selectedClientId = null;
    //   this.showForm = true;
    // },
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
          this.getAllClients();
          this.$nextTick(() => {
            this.$bvModal.hide("modal-cliente");
          });
        })
        .catch((error) => {
          console.error("Error al agregar el cliente:", error);
        });
    },
    checkFormValidity() {
      this.nameState = this.nombre.length > 0;
      // Valida el campo de teléfono
      this.phoneState = this.telefono.length > 0;
    },
    resetModal() {
      (this.nameState = null),
        (this.phoneState = null),
        (this.showForm = false),
        (this.nombre = ""),
        (this.telefono = ""),
        (this.dni = null),
        (this.description = null),
        (this.selectedClientName = ""),
        (this.selectedClientId = null);
      this.selectionError = false;
    },
    handleOk(bvModalEvent) {
      if (!this.showForm && this.selectedClientName !== "") {
        const selectedClient = this.clientes.find(
          (cliente) => cliente.nombre == this.selectedClientName
        );
        if (selectedClient) {
          this.selectedClientId = selectedClient.id;
          this.$emit("cliente-agregado", this.selectedClientId);
          this.$bvModal.hide("modal-cliente");
        } else {
          this.selectionError = true;
          this.errorText = "No se encuentra el cliente";
          bvModalEvent.preventDefault();
        }
      } else if (!this.showForm && this.selectedClientName == "") {
        this.selectionError = true;
        this.errorText = "Selecciona un cliente";
        bvModalEvent.preventDefault();
      } else {
        bvModalEvent.preventDefault();
        this.handleSubmit();
      }
    },

    handleSubmit() {
      this.checkFormValidity();
      if (!this.nameState || !this.phoneState) {
        return;
      }
      if (this.dni === null || this.dni.trim() === "") {
        this.dni = null;
      }
      const createClientDto = {
        nombre: this.nombre,
        telefono: this.telefono,
        dni: this.dni,
        descripcion: this.description,
      };
      this.addClient(createClientDto);
    },
  },
};
</script>
