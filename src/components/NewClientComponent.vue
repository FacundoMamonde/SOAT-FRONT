<template>
  <div class="h-100">
    <b-modal
      id="modal-cliente"
      v-model="modalShow"
      :title="this.titleModal()"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <div id="buscador">
        <div :style="{ display: showForm ? 'none' : 'flex' }">
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
              <button
                @click="openAddClient"
                class="btn btn-success btn-sm ms-2"
              >
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
                :items="filteredClientes()"
                :fields="fields"
                label-sort-asc=""
                label-sort-desc=""
                label-sort-clear=""
                select-mode="range"
                selectable
                @row-selected="onRowSelected"
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
        <div v-if="showForm" id="agregar">
          <ClientForm :modo="'agregar'" ref="UpdateClient" />
          <b-button
            @click="returnModal"
            size="sm"
            variant="primary"
            class="my-3"
          >
            <b-icon icon="arrow-left" aria-label="return"></b-icon>
          </b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { bus, backendData } from "../main";
import ClientForm from "./ClientFormComponent.vue";
export default {
  data() {
    return {
      modalShow: false,
      totalRows: null,
      currentPage: 1,
      perPage: 6,
      nameState: null,
      phoneState: null,
      clientes: [],
      showForm: false,
      nombre: "",
      telefono: "",
      dni: null,
      description: null,
      selectedClientName: "",
      selected: null,
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
  components: { ClientForm },
  created() {
    this.getAllClients();
    bus.$on("abrir-modal-en-cliente", () => {
      this.abrirModal();
    });
    bus.$on("cliente-agregado", () => {
      this.getAllClients();
    });
  },
  watch: {
    filtro() {
      this.filteredClientes();
      this.totalRows = this.clientes.length;
    },
  },
  methods: {
    onRowSelected(item) {
      this.selected = item;
    },

    filteredClientes() {
      if (this.searchQuery.trim() === "") {
        this.totalRows = this.clientes.length;
        return this.clientes;
      }
      const filteredClientes = this.clientes.filter((cliente) => {
        return (
          cliente.nombre
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          cliente.telefono.includes(this.searchQuery)
        );
      });
      this.currentPage=1;
      this.totalRows = filteredClientes.length;
      return filteredClientes;
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

    resetModal() {
      (this.selected = null),
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
      this.$emit("cerrar-modal-actual");
    },

    handleOk(bvModalEvent) {
      if (!this.showForm) {
        if (this.selected) {
          this.selectedClientId = this.selected[0].id;
          this.$emit("cliente-agregado", this.selectedClientId);
          this.$emit("cerrar-modal-actual");
          this.$bvModal.hide("modal-cliente");
        } else {
          this.selectionError = true;
          this.errorText = "Selecciona un cliente";
          bvModalEvent.preventDefault();
        }
      } else {
        bvModalEvent.preventDefault();
        this.$refs.UpdateClient.handleSubmit();
      }
    },
  },
};
</script>
<style scoped></style>
