<template>
  <div>
    <b-modal
      id="equiposModal"
      v-model="modalShow"
      :title="`Nuevo ${this.equipoProp}`"
      @ok="submitForm"
      @cancel="resetModal()"
    >
      <div class="modal-body d-flex flex-column">
        <label for="newData">
          {{ this.equipoProp }}
        </label>
        <input
          id="equipoProp"
          v-model="propName"
          type="text"
          :placeholder="this.equipoProp"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
import { backendData} from "../main";
export default {
  name: "NewEquipoComponent",
  props: {
    campo: { type: String, default: null },
  },
  data() {
    return {
      modalShow: false,
      propNombre: null,
      equipoProp: null,
      propName: null,
      selectedMarca: null,
      selectedTipoEquipo: null,
    };
  },
  mounted() {
    this.equipoProp = this.campo;
  },
  methods: {
    abrirModal(campo) {
      this.equipoProp = campo;
      this.modalShow = true;
    },

    addProp(propName) {
      if (this.equipoProp == "Tipo de equipo") this.addTipoEquipo(propName);
      if (this.equipoProp == "Marca") this.addMarca(propName);
      if (this.equipoProp == "Modelo") this.addModelo(propName);
    },

    addTipoEquipo(propName) {
      fetch(`${backendData}/tipo-equipo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propName),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error al agregar el equipo");
          }
        })
        .then((response) => {
          this.tipoEquipoId = response.id;
          this.$emit("tipo-equipo-agregado", this.tipoEquipoId);
        })
        .catch((error) => {
          console.error("Error al agregar el cliente:", error);
        });
    },

    actualizarSeleccion(selectedTipoEquipo, selectedMarca) {
      this.selectedTipoEquipo = selectedTipoEquipo;
      this.selectedMarca = selectedMarca;
    },

    addMarca(propName) {
      fetch(`${backendData}/marca`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propName),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error al agregar el equipo");
          }
        })
        .then((response) => {
          this.marcaId = response.id;
          this.$emit("marca-agregada", this.marcaId);
        })
        .catch((error) => {
          console.error("Error al agregar el cliente:", error);
        });
    },

    addModelo(propName) {
      const createModeloDto = {
        nombre: propName.nombre,
        marcaID: this.selectedMarca.id,
        tipoEquipoID: this.selectedTipoEquipo.id,
      };
      fetch(`${backendData}/modelo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createModeloDto),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error al agregar el modelo");
          }
        })
        .then((response) => {
          this.modeloId = response.id;
          this.$emit("modelo-agregado", this.modeloId);
        })
        .catch((error) => {
          console.error("Error al agregar el cliente:", error);
        });
    },

    submitForm() {
      const propiedadName = {
        nombre: this.propName,
      };
      this.addProp(propiedadName);
      this.modalShow = false;
    },
    resetModal() {
    this.propName=null
  }
  },


};
</script>
