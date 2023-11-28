<template>
  <div>
    
    <b-button
      v-b-modal.newOrderModal
      variant="success"
      class="ms-2 botonNewOrder"
      
      >Nueva orden</b-button>
    <b-modal
      centered
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
          <div class="col-md-1 icon-div">
            <i class="bi bi-person-circle col-md-8 icon"></i>
            <!-- Icono de Cliente-->
          </div>
          <div class="d-flex flex-row w-100">
            <div class="d-flex flex-column input-div">
              <input
                :class="{ 'border-danger': !cliente && showError }"
                class="m-0"
                :placeholder="
                  cliente && cliente.nombre
                    ? cliente.nombre
                    : 'Nombre de cliente'
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
        </div>
        <!-- Div Equipo -->
        <div class="d-flex flex-row mt-3 w-100">
          <div class="col-md-1 d-flex align-items-center icon-div">
            <i class="bi bi-laptop col-md-8 icon"></i>
            <!-- Icono de Equipo-->
          </div>
          <div class="d-flex flex-column w-100">
            <div class="d-flex w-100">
              <div class="input-div">
                <!-- Seleccion de tipo de Equipo -->
                <form action="#">
                  <select
                    class="my-1 w-100"
                    v-model="selectedTipoEquipo"
                    :class="{
                      'border-danger': !selectedTipoEquipo && showError,
                    }"
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
              </div>
              <button
                v-b-modal.equiposModal
                v-if="selectedTipoEquipo === ''"
                @click="abrirModal('Tipo de equipo', tipoEquipos)"
                class="btn btn-success btn-sm ms-2"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>

            <div class="d-flex w-100">
              <!-- Seleccion de Marca -->
              <div class="input-div">
                <form action="#">
                  <select
                    class="my-1 w-100"
                    v-model="selectedMarca"
                    :class="{ 'border-danger': !selectedMarca && showError }"
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
              </div>
              <button
                v-b-modal.equiposModal
                v-if="selectedTipoEquipo !== '' && selectedMarca == ''"
                @click="abrirModal('Marca', marcasEquipo)"
                class="btn btn-success btn-sm ms-2"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
            <div class="d-flex w-100">
              <!-- Seleccion de Modelo -->
              <div class="input-div">
                <form action="#">
                  <select
                    class="my-1 w-100"
                    v-model="selectedModelo"
                    :class="{ 'border-danger': !selectedModelo && showError }"
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
              </div>
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
            <div class="d-flex flex-column mt-1 input-div">
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
            class="col-12 p-0 m-0"
            rows="3"
          ></textarea>
        </div>
        <div>
          <h5 class="mt-3">Descripción de la falla</h5>
          <textarea
            :class="{ 'border-danger': !this.falla && showError }"
            v-model="falla"
            class="col-12 p-0 m-0"
            rows="3"
          ></textarea>
        </div>
      </div>
      <b-alert class="mt-3" show variant="primary" v-if="isBusy == true">
        <b-spinner class="ms-1 me-1" small variant="primary"></b-spinner>
        Procesando solicitud...
      </b-alert>
      <template #modal-footer="{ cancel, ok }">
        <b-button
          size="sm"
          variant="danger"
          @click="cancel()"
          :disabled="isBusy"
        >
          Cancel
        </b-button>
        <b-button size="sm" variant="success" @click="ok()" :disabled="isBusy">
          OK
        </b-button>
      </template>
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
      selected: "",
      isBusy: false,
    };
  },
  components: { NewClientComponent, NewEquipoComponent },

  created() {
    bus.$on("cliente-agregado", this.handleClienteAgregado);
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
      this.getClient(selectedClientId);
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
        this.isBusy = false;
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
        this.isBusy = true;
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
      if (this.selectedTipoEquipo != "" && this.selectedMarca != "") {
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
      } else {
        this.modelosEquipos = [];
      }
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
      } catch (error) {
        console.error("Error al agregar el equipo:", error);
        throw error;
      }
    },

    resetModal() {
      this.isBusy = false;
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
.icon-div {
  width: 50px;
}
.icon {
  font-size: 40px;
}
.input-div {
  width: 70%;
}
.botonNewOrder{
  white-space: nowrap;
}
</style>
