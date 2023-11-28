<template>
  <div id="generalDivClientes" class="p-3 ">
    <div class="d-flex flex-column  h-100">
    <div  class="m-3 buscador ">
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
    </div>
    <div class="m-3 d-flex flex-column flex-grow-1">
      <h5>Listado de clientes</h5>
      <div class="tabla border-top border-1  ">
        <b-table
          id="clientTable"
         
          class=" text-muted "
          :per-page="perPage"
          :current-page="currentPage"
          striped
          :items="filteredClientes"
          :fields="fields"
          label-sort-asc=""
          label-sort-desc=""
          label-sort-clear=""
        >
        <!-- borderless="true" -->
        <template #head()="data">
            <span class="text">{{ data.label }}</span>
          </template>
        <template #cell()="data">
            <td >
              <span class="text-secondary">{{ data.value }}</span>
            </td>
          </template>
          <!-- Botones de acciones -->
          <template v-slot:cell(actions)="data">
            <!-- Boton Historial Ordenes -->
            <span class="p-0 m-0 ">
              <a @click="(selectedClient = data.item), historialCliente()">
                <b-button
                  v-b-modal.modal-historial
                  size="sm"
                  variant="outline-primary"
                >
                  <b-icon icon="layout-text-sidebar" scale="1" />
                </b-button>
              </a>
            </span>
            <!-- Boton editar -->
            <span class="p-0 m-0 ms-3">
              <a >
                <b-button size="sm" variant="outline-secondary"  @click="(selectedClient = data.item)" v-b-modal.modal-editar
                  ><b-icon icon="pencil" scale="1"
                /></b-button>
                
              </a>
            </span>
            <!-- Boton eliminar -->
            <span class="p-0 m-0 ms-3">
              <a @click="resetModalEliminar(), (selectedClient = data.item)">
                <b-button
                  v-b-modal.modal-eliminar
                  size="sm"
                  variant="outline-danger"
                  ><b-icon icon="trash" scale="1"
                /></b-button>
              </a>
            </span>
          </template>
        </b-table></div>
        <div class="d-flex justify-content-center mt-auto ">
      <b-pagination
        size="sm"
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        aria-controls="clientTable"
      ></b-pagination>
    </div>
      </div>
      <!-- Modal editar-->
      <b-modal id="modal-editar" title="Editar cliente" @ok="editClient">
         <ClientForm :cliente="selectedClient" :modo="'editar'" @cliente-actualizado="getAllClients" ref="editar"></ClientForm>
                </b-modal>

      <!-- Modal eliminar-->
      <b-modal id="modal-eliminar" title="Eliminar cliente">
        <div v-if="!eliminarSuccess">
          <p v-if="!error_clienteEnUso" class="my-4">
            ¿Seguro que desea eliminar el cliente {{ selectedClient.nombre }}?
          </p>

          <b-alert v-if="error_clienteEnUso" show variant="warning">
            No se puede eliminar el cliente {{ selectedClient.nombre }}, está
            asociado a una orden
          </b-alert>
        </div>
        <div v-if="eliminarSuccess">
          <b-alert show variant="success">
            Se elimino cliente {{ selectedClient.nombre }} con éxito
          </b-alert>
        </div>
        <!-- Modal footer -->
        <template #modal-footer="{ ok }">
          <div v-if="!error_clienteEnUso && !eliminarSuccess">
            <b-button
              size="sm"
              variant="primary"
              @click="ok(), getAllClients()"
            >
              Cancelar
            </b-button>
            <b-button
              size="sm"
              variant="danger"
              @click="eliminarCliente(selectedClient), getAllClients()"
            >
              Eliminar
            </b-button>
          </div>
          <div v-if="error_clienteEnUso || eliminarSuccess">
            <b-button
              size="sm"
              variant="primary"
              @click="ok(), getAllClients()"
            >
              Cerrar
            </b-button>
          </div>
        </template>
      </b-modal>
      <!-- / Modal historial-->
      <b-modal id="modal-historial" title="Historial del cliente">
        <b-table
          :items="ordenesCliente"
          :fields="fieldsModalHistorial"
          label-sort-asc=""
          label-sort-desc=""
          label-sort-clear=""
        >
        </b-table>
      </b-modal>
    </div>
   
  </div>
</template>

<script>
import {bus, backendData } from "../main";
import ClientForm from "./ClientFormComponent.vue";
export default {
  name: "ClientesComponent",
  props: { mensaje:Boolean},
  components:{ClientForm},
  data() {
    return {
      clientes: [],
      totalRows: null,
      currentPage: 1,
      perPage: 10,
      fields: [
        { key: "nombre", label: "Nombre", sortable: true },
        { key: "telefono", label: "Telefono", sortable: true },
        { key: "dni", label: "DNI", sortable: true },
        { key: "descripcion", label: "Descripción", sortable: true },
        { key: "actions", label: "" },
      ],
      fieldsModalHistorial: [
        { key: "id", label: "#O", sortable: true },
        { key: "equipo.modelo.tipoEquipo.nombre", label: "Tipo" },
        { key: "equipo.modelo.marca.nombre", label: "Marca" },
        { key: "equipo.modelo.nombre", label: "Modelo" },
        { key: "falla", label: "Falla" },
      ],
      selectedClient: Object,
      error_clienteEnUso: false,
      responseMessege: String,
      eliminarSuccess: false,
      searchQuery: "",
      ordenesCliente: Array,
    };
  },
  computed: {
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
  },


  created() {
  
  bus.$on("cliente-agregado", this.getAllClients);
  

    this.getAllClients();
  },
  methods: {
    async getAllClients() {
      console.log("haciendo el get")
      await fetch(`${backendData}/cliente`)
        .then((response) => response.json())
        .then((clientes) => {
          this.clientes = clientes;
          this.totalRows = this.clientes.length;
          console.log("haciendo el get")
        })
        .catch((error) => {
          console.error("Error al obtener los clientes:", error);
        });
    },

    async eliminarCliente(cliente) {
      console.log(cliente)
      await fetch(`${backendData}/cliente/${cliente.id}`, { method: "DELETE" })
        .then((response) => response.json())
        .then((response) => {
          this.responseMessege = response.message;
        })
        .catch((error) => {
          throw error;
        });

      if (this.responseMessege == "ERROR_CLIENTE_EN_USO") {
        this.error_clienteEnUso = true;
        return false;
      }

      this.eliminarSuccess = true;
      return true;
    },

    async historialCliente() {
      await fetch(`${backendData}/orden/cliente/${this.selectedClient.id}`)
        .then((response) => response.json())
        .then((response) => {
          this.ordenesCliente = response;
          console.log(this.ordenesCliente);
        })
        .catch((error) => {
          throw error;
        });
    },

    resetModalEliminar() {
      (console.log(this.selectedClient)),
      (this.selectedClient = {}),
        (this.error_clienteEnUso = false),
        (this.responseMessege = ""),
        (this.eliminarSuccess = false);
    },
     editClient(bvModalEvent) {
      bvModalEvent.preventDefault();
      this.$refs.editar.handleSubmit();
     },
  },
};
</script>

<style scoped>
#generalDivClientes {
  background-color: #f3f3f3;
}

.textError {
  color: red;
}
.tabla {
 
  white-space: nowrap;
}

.tabla::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.tabla::-webkit-scrollbar-thumb {
  background-color: #6c757d;
  border-radius: 5px;
}

.tabla::-webkit-scrollbar-track {
  background-color: transparent;
}

.tabla {
  overflow-x: scroll !important;

  white-space: nowrap;
  scrollbar-width: thin;
  scrollbar-color: #6c757d transparent;
}

.text {
  color: #161616;
}

.text-secondary {
  color: rgb(36, 36, 36);
}

.tabla::-webkit-scrollbar-thumb {
  background-color: #505050;
  border-radius: 5px;
}

.tabla::-webkit-scrollbar-track {
  background-color: transparent;
}

.tabla {
  overflow-x: scroll !important;
  white-space: nowrap;
  scrollbar-width: thin;
  scrollbar-color: #6c757d transparent;
}
.buscador{
  width: 300px;
}
input:focus
 {
  outline: none;
  box-shadow: none;
}
</style>
