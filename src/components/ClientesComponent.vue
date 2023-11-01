<template>
    <div id="generalDivClientes">
        <div>
            <h2>Clientes</h2>
            <b-button href="/ingresadas">Volver a ordenes</b-button>
            <b-button @click="getAllClients()">Recargar</b-button>
            <div class="mb-3">
                <b-form-input v-model="searchQuery" placeholder="Buscar por nombre o telefono" />
            </div>
        </div>
        <div>
            <b-table striped hover :items="filteredClientes" :fields="fields" label-sort-asc="" label-sort-desc=""
                label-sort-clear="">
                <!-- Botones de acciones -->
                <template v-slot:cell(actions)="data">
                    <!-- Boton Historial Ordenes -->
                    <span class="p-0 m-0">
                        <a @click="selectedClient = data.item, historialCliente()">
                            <b-button v-b-modal.modal-historial size="sm" variant="outline-danger">
                                <b-icon icon="layout-text-sidebar" scale="1" />
                            </b-button>
                        </a>
                    </span>
                    <!-- Boton editar -->
                    <span class="p-0 m-0">
                        <a @click="editarCliente(data.item)">
                            <b-button size="sm" variant="outline-primary"><b-icon icon="pencil" scale="1" /></b-button>
                        </a>
                    </span>
                    <!-- Boton eliminar -->
                    <span class="p-0 m-0">
                        <a @click="resetModalEliminar(), selectedClient = data.item">
                            <b-button v-b-modal.modal-eliminar size="sm" variant="outline-danger"><b-icon icon="trash"
                                    scale="1" /></b-button>
                        </a>
                    </span>
                </template>
            </b-table>
        </div>
        <!-- Modal eliminar-->
        <b-modal id="modal-eliminar" title="Eliminar cliente">
            <div v-if="!eliminarSuccess">
                <p v-if="!error_clienteEnUso" class="my-4">
                    ¿Seguro que desea eliminar el cliente {{ selectedClient.nombre }}?
                </p>

                <b-alert v-if="error_clienteEnUso" show variant="warning">
                    No se puede eliminar el cliente {{ selectedClient.nombre }}, está asociado a una orden
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
                    <b-button size="sm" variant="primary" @click="ok(), getAllClients()">
                        Cancelar
                    </b-button>
                    <b-button size="sm" variant="danger" @click="eliminarCliente(selectedClient), getAllClients()">
                        Eliminar
                    </b-button>
                </div>
                <div v-if="error_clienteEnUso || eliminarSuccess">
                    <b-button size="sm" variant="primary" @click="ok(), getAllClients()">
                        Cerrar
                    </b-button>
                </div>
            </template>
        </b-modal>
        <!-- / Modal historial-->
        <b-modal id="modal-historial" title="Historial del cliente">
            <b-table :items="ordenesCliente"
            :fields="['id', 'falla','equipo.modelo.nombre']">

            </b-table>

        </b-modal>

    </div>
</template>
  
<script>
import { backendData } from "../main";

export default {
    name: "ClientesComponent",
    props: {
    },
    data() {
        return {
            clientes: [],
            fields: [
                { key: "nombre", label: "Nombre", sortable: true },
                { key: "telefono", label: "Telefono", sortable: true },
                { key: "dni", label: "DNI", sortable: true },
                { key: "descripcion", label: "Descripción", sortable: true },
                { key: "actions", label: "" }
            ],
            selectedClient: Object,
            error_clienteEnUso: false,
            responseMessege: String,
            eliminarSuccess: false,
            searchQuery: "",
            ordenesCliente: Array,
        }
    },
    computed: {
        filteredClientes() {
            if (this.searchQuery.trim() === "") {
                return this.clientes;
            }

            return this.clientes.filter((cliente) => {
                return (
                    cliente.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    cliente.telefono.includes(this.searchQuery)
                    // Add more fields to search if needed
                );
            });
        },
    },
    created() {
        this.getAllClients()
    },
    methods: {
        async getAllClients() {
            await fetch(`${backendData}/cliente`)
                .then((response) => response.json())
                .then((clientes) => {
                    this.clientes = clientes;
                })
                .catch((error) => {
                    console.error("Error al obtener los clientes:", error);
                });
        },

        async eliminarCliente(cliente) {
            await fetch(`${backendData}/cliente/${cliente.id}`, { method: 'DELETE' })
                .then((response) => response.json())
                .then((response) => {
                    this.responseMessege = response.message;
                })
                .catch((error) => {
                    throw error
                });

            if (this.responseMessege == "ERROR_CLIENTE_EN_USO") {
                this.error_clienteEnUso = true
                return false
            }

            this.eliminarSuccess = true
            return true
        },

        async historialCliente() {

            await fetch(`${backendData}/orden`)
                .then((response) => response.json())
                .then((response) => {
                    this.ordenesCliente = response
                    
                })
                .catch((error) => {
                    throw error
                });
            
        },

        resetModalEliminar() {
            this.selectedClient = {},
                this.error_clienteEnUso = false,
                this.responseMessege = "",
                this.eliminarSuccess = false
        }
        ,
        editarCliente() {
            console.log("Editando cliente")
        }
    }
};
</script>
  
<style scoped>
#generalDivClientes {
    background-color: white;
}

.textError {
    color: red;
}
</style>
  