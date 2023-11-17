<template>
  <div>
    <b-button
      v-b-modal.newOrderModal
      variant="success rounded-pill"
      class="ms-2 fw-bold"
      >+</b-button
    >
    <b-modal
      ref="newOrderModal"
      id="newOrderModal"
      title="Nueva Orden"
      @ok="submitForm"
      @cancel="resetModal"
      hide-header-close
      no-close-on-backdrop
      no-close-on-esc
      no-stacking
    >
      <div class="modal-body">
        <!-- Div Cliente -->
        <div class="d-flex flex-row">
          <div class="col-md-1" style="width: 50px">
            <i class="bi bi-person-circle col-md-8" style="font-size: 40px"></i>
            <!-- Icono de Cliente-->
          </div>
          <div class="d-flex flex-column" style="width: 260px">
            <input
              :class="{ 'border-danger': !cliente && showError }"
              class="m-0"
              :placeholder="
                cliente && cliente.nombre ? cliente.nombre : 'Nombre de cliente'
              "
              readonly
            />
            <input
              :class="{ 'border-danger': !cliente && showError }"
              class="mt-2"
              :placeholder="
                cliente && cliente.telefono
                  ? cliente.telefono
                  : 'Celular del cliente'
              "
              readonly
            />
          </div>
          <div class="col-md-1 d-flex align-items-center">
            <b-button
              v-b-modal.modal-cliente
              variant="primary"
              class="btn btn-sm ms-2"
              ><i class="bi bi-search"></i
            ></b-button>
          </div>
        </div>
        <!-- Div Equipo -->
        <div class="d-flex flex-row mt-3">
          <div class="col-md-1 d-flex align-items-center" style="width: 50px">
            <i class="bi bi-laptop col-md-8" style="font-size: 40px"></i>
            <!-- Icono de Equipo-->
          </div>
          <div class="d-flex flex-column">
            <div class="d-flex">
              <!-- Seleccion de tipo de Equipo -->
              <form action="#" style="width: 260px">
                <select
                  class="my-1"
                  v-model="selectedTipoEquipo"
                  :class="{ 'border-danger': !selectedTipoEquipo && showError }"
                  style="width: 100%"
                >
                  <option value="">---Tipo de Equipo---</option>
                  <option
                    v-for="tipo in tipoEquipos"
                    :key="tipo.id"
                    :value="tipo"
                  >
                    {{ tipo.nombre }}
                  </option>
                </select>
              </form>
              <button
                v-b-modal.equiposModal
                v-if="selectedTipoEquipo === ''"
                @click="abrirModal('Tipo de equipo', tipoEquipos)"
                class="btn btn-success btn-sm ms-2"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>

            <div class="d-flex">
              <!-- Seleccion de Marca -->
              <form action="#" style="width: 260px">
                <select
                  class="my-1"
                  v-model="selectedMarca"
                  :class="{ 'border-danger': !selectedMarca && showError }"
                  style="width: 100%"
                  required
                >
                  <option value="">---Marca del equipo---</option>
                  <option
                    v-for="marca in marcasEquipo"
                    :key="marca.id"
                    :value="marca"
                  >
                    {{ marca.nombre }}
                  </option>
                </select>
              </form>
              <button
                v-b-modal.equiposModal
                v-if="selectedTipoEquipo !== '' && selectedMarca == ''"
                @click="abrirModal('Marca', marcasEquipo)"
                class="btn btn-success btn-sm ms-2"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
            <div class="d-flex">
              <!-- Seleccion de Modelo -->
              <form action="#" style="width: 260px">
                <select
                  class="my-1"
                  v-model="selectedModelo"
                  :class="{ 'border-danger': !selectedModelo && showError }"
                  style="width: 100%"
                  required
                >
                  <option value="">---Modelo del equipo---</option>
                  <option
                    v-for="modelo in modelosEquipos"
                    :key="modelo.id"
                    :value="modelo"
                  >
                    {{ modelo.nombre }}
                  </option>
                </select>
              </form>
              <button
                v-b-modal.equiposModal
                v-if="
                  selectedTipoEquipo !== '' &&
                  selectedMarca !== '' &&
                  selectedModelo == ''
                "
                @click="
                  abrirModal(
                    'Modelo',
                    modelosEquipos,
                    selectedTipoEquipo,
                    selectedMarca
                  )
                "
                class="btn btn-success btn-sm ms-2"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
            <div class="d-flex flex-column mt-1" style="width: 260px">
              <input
                class="m-0"
                placeholder="Numero de serie "
                v-model="selectedNroSerie"
              />
            </div>
          </div>
        </div>

        <div>
          <h5 class="mt-3">Accesorios</h5>
          <textarea
            v-model="accesorios"
            class="col-11 p-0 m-0"
            style="
              height: 80px;
              min-height: 80px;
              max-height: 120px;
              width: 95%;
            "
            name=""
            id=""
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <div>
          <h5 class="mt-3">Descripción de la falla</h5>
          <textarea
            :class="{ 'border-danger': !this.falla && showError }"
            v-model="falla"
            class="col-11 p-0 m-0"
            style="
              height: 80px;
              min-height: 80px;
              max-height: 120px;
              width: 95%;
            "
            name=""
            id=""
            cols="30"
            rows="10"
          ></textarea>
        </div>
      </div>
    </b-modal>
    <NewClientComponent
      ref="clientComponent"
      @cliente-agregado="getClient"
      @cerrar-modal-actual="abrirNuevoModal"
    ></NewClientComponent>
    <NewEquipoComponent
      ref="newOrderComponent"
      @cerrar-modal-equipo="abrirNuevoModal"
      @tipo-equipo-agregado="getTipoEquipoById"
      @marca-agregada="getMarcaById"
      @modelo-agregado="getModeloById"
    ></NewEquipoComponent>
  </div>
</template>

<script>
import { bus, backendData } from "../main";
import NewClientComponent from "./NewClientComponent.vue";
import NewEquipoComponent from "./NewEquipoComponent.vue";

export default {
  name: "NewOrderComponent",
  data() {
    return {
      clientID: null,
      cliente: null,
      tipoEquipos: [],
      marcasEquipo: [],
      modelosEquipos: [],
      selectedTipoEquipo: "",
      selectedMarca: "",
      selectedModelo: "",
      accesorios: null,
      falla: null,
      newEquipoID: null,
      campo: "",
      selectedNroSerie: null,
      equipo: {},
      showError: false,
      allProp: [],
      selected:""
    };
  },
  components: { NewClientComponent, NewEquipoComponent },

  created() {
    bus.$on("cliente-agregado", this.handleClienteAgregado)
    this.getTiposEquipo();
    this.getMarcasEquipo();
  },

  watch: {
    selectedTipoEquipo() {
      this.getTiposEquipo();
      this.getModelosEquipo();
      this.selectedModelo = "";
    },

    selectedMarca() {
      this.getMarcasEquipo();
      this.getModelosEquipo();
      this.selectedModelo = "";
    },

    selectedModelo() {
      this.getModelosEquipo();
      this.selectedModelo;
    },
  },

  methods: {
    handleClienteAgregado(selectedClientId) {
      this.getClient(selectedClientId)
    },
    abrirNuevoModal() {
      this.$bvModal.show("newOrderModal");
    },

    async addNewOrder() {
      const orden = {
        accesorio: this.accesorios,
        falla: this.falla,
        id_cliente: this.cliente.id,
        id_equipo: this.equipo.id,
      };
      try {
        const response = await fetch(`${backendData}/orden/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orden),
        });

        if (!response.ok) {
          throw new Error("Error al agregar la orden");
        }
        await response.json();
        bus.$emit("orden-agregada");
      } catch (error) {
        console.error("Error al agregar la orden:", error);
        throw error;
      }
    },

    async submitForm(bvModalEvent) {
      bvModalEvent.preventDefault();
      if (!this.selectedModelo || !this.falla || !this.cliente) {
        this.showError = true;
        bvModalEvent.preventDefault();
      } else {
        this.showError = false;
        try {
          await this.addNewEquipo();
          await this.addNewOrder();
          this.$bvModal.hide("newOrderModal");
          this.resetModal();
        } catch (error) {
          console.error("Error al agregar equipo u orden:", error);
        }
      }
    },

    abrirModal(campo, allProp) {
      this.modalS = false;
      this.campo = campo;
      this.$refs.newOrderComponent.abrirModal(campo, allProp);
      if (campo === "Modelo") {
        this.$refs.newOrderComponent.actualizarSeleccion(
          this.selectedTipoEquipo,
          this.selectedMarca
        );
      }
    },
    getClient(clientID) {
      this.clientID = clientID;
      this.getClientById(clientID);
    },
   
    getTiposEquipo() {
      fetch(`${backendData}/tipo-equipo`)
        .then((response) => response.json())
        .then((data) => {
          this.tipoEquipos = data;
        })
        .catch((error) => {
          console.error("Error al obtener los tipos de equipo", error);
        });
    },


    getDataById(id, data, targetProperty) {
  fetch(`${backendData}/${data}/${id}`)
    .then((response) => response.json())
    .then((responseData) => {
      this[targetProperty] = responseData;
    })
    .catch((error) => {
      console.error(`Error al obtener la ${data} de equipo`, error);
    });
},
getClientById(id) {
  this.getDataById(id, "cliente", "cliente");
    },

getMarcaById(id) {
  this.getDataById(id, "marca", "selectedMarca");
},

getModeloById(id) {
  this.getDataById(id, "modelo", "selectedModelo");
},

getTipoEquipoById(id) {
  this.getDataById(id, "tipo-equipo", "selectedTipoEquipo");
},


    getMarcasEquipo() {
      fetch(`${backendData}/marca`)
        .then((response) => response.json())
        .then((data) => {
          this.marcasEquipo = data;
          this.getModelosEquipo();
        })
        .catch((error) => {
          console.error("Error al obtener las marcas de equipo", error);
        });
    },

    getModelosEquipo() {
      fetch(
        `${backendData}/modelo/search?id_tipo_equipo=${this.selectedTipoEquipo.id}&id_marca=${this.selectedMarca.id}`
      )
        .then((response) => response.json())
        .then((data) => {
          this.modelosEquipos = data;
        })
        .catch((error) => {
          console.error("Error al obtener los modelos de equipo", error);
        });
    },

    async addNewEquipo() {
      this.getModeloById(this.selectedModelo.id);
      try {
        const equipo = {
          n_serie: this.selectedNroSerie,
          modeloID: this.selectedModelo.id,
        };
        const response = await fetch(`${backendData}/equipo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(equipo),
        });

        if (!response.ok) {
          throw new Error("Error al agregar el equipo");
        }
        const data = await response.json();
        this.equipo = data;
        console.log("se agrego el equipo");
      } catch (error) {
        console.error("Error al agregar el equipo:", error);
        throw error;
      }
    },

    resetModal() {
      this.clientID = null;
      this.cliente = null;
      this.selectedTipoEquipo = "";
      this.selectedMarca = "";
      this.selectedModelo = "";
      this.accesorios = null;
      this.falla = null;
      this.selectedNroSerie = null;
      this.equipo = {};
      this.showError = false;
    },
  },
};
</script>

<style scoped>
input:focus,
select:focus,
textarea:focus {
  outline: none;
}
input,
select,
textarea {
  border-radius: 3px;
  border: 1px solid #ccc;
}
</style>
