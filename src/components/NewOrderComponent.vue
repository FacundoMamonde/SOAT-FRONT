<template>
  <div>
    <b-button
      @click="modalShow = !modalShow"
      variant="success rounded-pill"
      class="ms-2 fw-bold"
      >+</b-button
    >
    <b-modal
      v-model="modalShow"
      title="Nueva Orden"
      @ok="submitForm"
      @cancel="resetModal()"
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
              class="m-0"
              :placeholder="
                cliente && cliente.nombre ? cliente.nombre : 'Nombre de cliente'
              "
              readonly
            />
            <input
              class="mt-0"
              :placeholder="
                cliente && cliente.telefono
                  ? cliente.telefono
                  : 'Celular del cliente'
              "
              readonly
            />
          </div>
          <NewClientComponent
            @cliente-agregado="getClient"
          ></NewClientComponent>
        </div>
        <!-- Div Equipo -->
        <div class="d-flex flex-row mt-1">
          <div class="col-md-1 mt-3" style="width: 50px">
            <i class="bi bi-laptop col-md-8" style="font-size: 40px"></i>
            <!-- Icono de Equipo-->
          </div>
          <div class="d-flex flex-column">
            <div class="d-flex">
              <!-- Seleccion de tipo de Equipo -->
              <form action="#" style="width: 260px">
                <select v-model="selectedTipoEquipo" style="width: 100%">
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
                v-if="selectedTipoEquipo === ''"
                @click="abrirModal('Tipo de equipo', '', '')"
                class="btn btn-success btn-sm ms-2"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
            <div class="d-flex">
              <!-- Seleccion de Marca -->
              <form action="#" style="width: 260px">
                <select v-model="selectedMarca" style="width: 100%">
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
                v-if="selectedTipoEquipo !== '' && selectedMarca == ''"
                @click="abrirModal('Marca', selectedTipoEquipo, '')"
                class="btn btn-success btn-sm ms-2"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
            <div class="d-flex">
              <!-- Seleccion de Modelo -->
              <form action="#" style="width: 260px">
                <select v-model="selectedModelo" style="width: 100%">
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
                v-if="
                  selectedTipoEquipo !== '' &&
                  selectedMarca !== '' &&
                  selectedModelo == ''
                "
                @click="abrirModal('Modelo', selectedTipoEquipo, selectedMarca)"
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
          <div class="d-flex flex-column">
            <NewEquipoComponent
              ref="newOrderComponent"
              @tipo-equipo-agregado="updateSelectedTipoEquipo"
              @marca-agregada="updateSelectedMarca"
              @modelo-agregado="updateSelectedModelo"
            ></NewEquipoComponent>
          </div>
        </div>

        <div>
          <h5 class="mt-3">Accesorios</h5>
          <textarea
            v-model="accesorios"
            class="col-11 p-0 m-0"
            style="
              height: 100px;
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
            v-model="falla"
            class="col-11 p-0 m-0"
            style="
              height: 100px;
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
      modalShow: false,
      clientID: null,
      cliente: null,
      tipoEquipos: [],
      selectedTipoEquipo: "",
      marcasEquipo: [],
      selectedMarca: "",
      modelosEquipos: [],
      selectedModelo: "",
      accesorios: null,
      falla: null,
      newEquipoID: null,
      campo: "",
      selectedNroSerie: null,
      equipo: {},
    };
  },
  components: { NewClientComponent, NewEquipoComponent },

  created() {
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
    updateSelectedTipoEquipo(tipoEquipoId) {
      this.getTipoEquipoById(tipoEquipoId);
    },

    updateSelectedMarca(marcaId) {
      this.getMarcaById(marcaId);
    },

    updateSelectedModelo(modeloId) {
      this.getModeloById(modeloId);
    },

    abrirModal(campo) {
      this.campo = campo;
      this.$refs.newOrderComponent.abrirModal(campo);
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

    getClientById(clientId) {
      fetch(`${backendData}/cliente/${clientId}`)
        .then((response) => response.json())
        .then((cliente) => {
          this.cliente = cliente;
        })
        .catch((error) => {
          console.error("Error al obtener el cliente:", error);
        });
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
    getTipoEquipoById(id) {
      fetch(`${backendData}/tipo-equipo/${id}`)
        .then((response) => response.json())
        .then((data) => {
          this.selectedTipoEquipo = data;
        })
        .catch((error) => {
          console.error("Error al obtener el tipo de equipo", error);
        });
    },

    getMarcaById(id) {
      fetch(`${backendData}/marca/${id}`)
        .then((response) => response.json())
        .then((data) => {
          this.selectedMarca = data;
        })
        .catch((error) => {
          console.error("Error al obtener la marca de equipo", error);
        });
    },

    getModeloById(id) {
      return fetch(`${backendData}/modelo/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener el modelo de equipo");
          }
          return response.json();
        })
        .then((data) => {
          this.selectedModelo = data;
        })
        .catch((error) => {
          console.error("Error al obtener el de equipo", error);
        });
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
      } catch (error) {
        console.error("Error al agregar el equipo:", error);
        throw error;
      }
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

    async submitForm() {
      try {
        await this.addNewEquipo();
        await this.addNewOrder();
        this.resetModal()
      } catch (error) {
        console.error("Error al agregar equipo u orden:", error);
      }
    },
    resetModal() {
      this.modalShow = false;
      this.clientID = null;
      this.cliente = null;
      this.selectedTipoEquipo = "";
      this.selectedMarca = "";
      this.selectedModelo = "";
      this.accesorios = null;
      this.falla = null;
      this.selectedNroSerie = null;
      this.equipo = {};
    },
  },
};
</script>

<style scoped></style>