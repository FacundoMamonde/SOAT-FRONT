<template>
  <div>
    <b-button
      @click="modalShow = !modalShow"
      variant="success rounded-pill"
      class="ms-2 fw-bold"
      >+</b-button
    >
    <b-modal v-model="modalShow" title="Nueva Orden" @ok="submitForm">
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
                cliente && cliente.name ? cliente.name : 'Nombre de cliente'
              "
              readonly
            />
            <input
              class="mt-0"
              :placeholder="
                cliente && cliente.phone ? cliente.phone : 'Celular del cliente'
              "
              readonly
            />
          </div>
          <NewClientComponent
            @variable-enviada="manejarVariableEnviada"
          ></NewClientComponent>
        </div>
        <!-- Div Equipo -->
        <div class="d-flex flex-row mt-2">
          <div class="col-md-1" style="width: 50px">
            <i class="bi bi-laptop col-md-8" style="font-size: 40px"></i>
            <!-- Icono de Equipo-->
          </div>
          <div class="d-flex flex-column">
            <div class="d-flex">
              <!-- Seleccion de tipo de Equipo -->
              <form action="#" style="width: 260px">
                <select v-model="selectedTipoEquipo" style="width: 100%">
                  <option value="">---Tipo de Equipo---</option>
                  <option v-for="tipo in tipoEquipos" :key="tipo" :value="tipo">
                    {{ tipo }}
                  </option>
                </select>
              </form>
              <button
                v-if="selectedTipoEquipo === ''"
                @click="abrirModal('', '')"
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
                    :key="marca"
                    :value="marca"
                  >
                    {{ marca }}
                  </option>
                </select>
              </form>
              <button
                v-if="selectedTipoEquipo !== '' && selectedMarca == ''"
                @click="abrirModal(selectedTipoEquipo, '')"
                class="btn btn-success btn-sm ms-2"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
            <div class="d-flex">
              <!-- Seleccion de Modelo -->
              <form action="#" style="width: 260px">
                <select
                  v-model="selectedModelo"
                  name="equiposType"
                  id="eModel"
                  style="width: 100%"
                >
                  <option value="">---Modelo equipo---</option>
                  <option
                    v-for="modelo in modelosEquipos"
                    :key="modelo"
                    :value="modelo"
                    v-on:click="getIdEquipo()"
                  >
                    {{ modelo }}
                  </option>
                </select>
              </form>
              <button
                v-if="
                  selectedTipoEquipo !== '' &&
                  selectedMarca !== '' &&
                  selectedModelo == ''
                "
                @click="abrirModal(selectedTipoEquipo, selectedMarca)"
                class="btn btn-success btn-sm ms-2"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
          <div class="d-flex flex-column">
            <NewEquipoComponent
              ref="newOrderComponent"
              @enviarID="getnewEquipoID"
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
      accesorios: "",
      falla: "",
      newEquipoID: null,
    };
  },
  components: { NewClientComponent, NewEquipoComponent },
  created() {
    fetch("http://localhost:3000/equipo/tipo")
      .then((response) => response.json())
      .then((data) => {
        this.tipoEquipos = data;
        console.log(data);
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de equipo", error);
      });
  },
  watch: {
    selectedTipoEquipo() {
      this.getMarcasEquipo();
    },
    selectedMarca() {
      this.getModelosEquipo();
    },
  },
  methods: {
    abrirModal(tipoEquipo, marcaEquipo) {
      this.selectedTipoEquipo = tipoEquipo;
      this.selectedMarca = marcaEquipo;
      this.$refs.newOrderComponent.abrirModal(tipoEquipo, marcaEquipo);
    },
    getnewEquipoID(newEquipoID) {
      this.newEquipoID = Number(newEquipoID);
      console.log("el id es " + Number(this.newEquipoID));
    },
    manejarVariableEnviada(variable) {
      this.clientID = Number(variable);
      this.getClientById(variable);
      console.log(variable);
    },
    getClientById(clientId) {
      fetch(`http://localhost:3000/cliente/${clientId}`)
        .then((response) => response.json())
        .then((cliente) => {
          this.cliente = cliente;
        })
        .catch((error) => {
          console.error("Error al obtener el cliente:", error);
        });
    },
    getMarcasEquipo() {
      fetch(`http://localhost:3000/equipo/marca/${this.selectedTipoEquipo}`)
        .then((response) => response.json())
        .then((data) => {
          this.marcasEquipo = data;
          console.log(data);
        })
        .catch((error) => {
          console.error("Error al obtener las marcas de equipo", error);
        });
    },
    getIdEquipo() {
      fetch(`http://localhost:3000/equipo/findid/${this.selectedModelo}/${this.selectedMarca}/${this.selectedTipoEquipo}`)
        .then((response) => response.json())
        .then((data) => {
          this.newEquipoID = parseInt(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error al obtener la id del equipo", error);
        });
    },

    addNewOrder(orden) {
      fetch("http://localhost:3000/orden", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orden),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error al agregar la orden");
          }
        })

        .catch((error) => {
          console.error("Error al agregar el cliente:", error);
        });
    },
    submitForm() {
      const newOrder = {
        accesorio: this.accesorios,
        falla: this.falla,
        clienteID: this.clientID,
        equipoID: this.newEquipoID,
      };
      console.log("este es el id del ciente " + this.clientID);
      this.addNewOrder(newOrder);
      console.log(newOrder);
    },
    getModelosEquipo() {
      fetch(
        `http://localhost:3000/equipo/modelo/${this.selectedMarca}/${this.selectedTipoEquipo}`
      )
        .then((response) => response.json())
        .then((data) => {
          this.modelosEquipos = data;
          console.log(data);
        })
        .catch((error) => {
          console.error("Error al obtener los modelos del equipo:", error);
        });
    },
  },
};
</script>

<style scoped></style>
