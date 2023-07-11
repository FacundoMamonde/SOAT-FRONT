<template>
  <div>
    <b-modal
      id="equiposModal"
      v-model="modalShow"
      title="Nuevo Equipo"
      @ok="submitForm"
    >
      <div class="modal-body d-flex flex-column">
        <label for="tipoEquipo">Tipo de Equipo:</label>
        <input
          id="tipoEquipo"
          type="text"
          v-model="tipoEquipoSeleccionado"
          :placeholder="selectTipoEquipo ? selectTipoEquipo : 'Tipo de Equipo'"
          :readonly="equipoSeleccionado"
        />

        <label for="marcaEquipo">Marca del Equipo:</label>
        <input
          id="marcaEquipo"
          type="text"
          v-model="marcaSeleccionada"
          :placeholder="selectMarca ? selectMarca : 'Marca del Equipo'"
          :readonly="marcaSeleccion"
        />

        <label for="modeloEquipo">Modelo del Equipo:</label>
        <input
          id="modeloEquipo"
          type="text"
          v-model="modeloSeleccionado"
          :placeholder="selectModelo ? selectModelo : 'Modelo del Equipo'"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "NewEquipoComponent",
  props: {
    selectTipoEquipo: {
      type: String,
      default: "",
    },
    selectMarca: {
      type: String,
      default: "",
    },
    selectModelo: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      modalShow: false,
      tipoEquipoSeleccionado: "",
      marcaSeleccionada: "",
      modeloSeleccionado: "",
      equipoSeleccionado: false,
      marcaSeleccion: false,
      equipoID: null,
    };
  },
  mounted() {
    this.tipoEquipoSeleccionado = this.selectTipoEquipo;
    this.marcaSeleccionada = this.selectMarca;
    this.modeloSeleccionado = this.selectModelo;
  },
  methods: {
    abrirModal(tipoEquipo, marcaEquipo) {
      this.modalShow = true;
      this.tipoEquipoSeleccionado = tipoEquipo;
      this.marcaSeleccionada = marcaEquipo;
      this.modeloSeleccionado = "";
      this.readStatus(tipoEquipo, marcaEquipo);
    },
    readStatus(tipoEquipo, marcaEquipo) {
      if (tipoEquipo !== "") {
        this.equipoSeleccionado = true;
      }
      if (marcaEquipo !== "") {
        this.marcaSeleccion = true;
      }
    },
    addEquipo(equipo) {
      fetch("http://localhost:3000/equipo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipo),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error al agregar el equipo");
          }
        })
        .then((response) => {
          this.equipoID = response.newID;
          console.log("el id es " + this.equipoID);
          this.$emit("enviarID", this.equipoID);
        })
        .catch((error) => {
          console.error("Error al agregar el cliente:", error);
        });
    },
    submitForm() {
      const newEquipo = {
        nSerie: "",
        tipoEquipo: this.tipoEquipoSeleccionado,
        marca: this.marcaSeleccionada,
        modelo: this.modeloSeleccionado,
      };
      this.addEquipo(newEquipo);
      this.modalShow = false;
    },
  },
};
</script>
