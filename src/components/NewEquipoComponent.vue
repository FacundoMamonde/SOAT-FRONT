<template>
  <div>
    <button v-b-modal.equiposModal class="btn btn-success btn-sm ms-2">
      <i class="bi bi-plus-lg"></i>
    </button>
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
      <p v-if="exist" class="text-danger">ya existe</p>
    </b-modal>
  </div>
</template>

<script>
import { backendData } from "../main";
export default {
  name: "NewEquipoComponent",
  props: {
    campo: { type: String, default: null },
    allProp: [],
    selectedMarca: null,
    selectedTipoEquipo: null,
  },
  data() {
    return {
      modalShow: false,
      propNombre: null,
      equipoProp: null,
      propName: null,
      datosRecibidos: null,
      marca: this.selectedMarca,
      tipoEquipo: this.selectedTipoEquipo,
      exist: false,
    };
  },
  mounted() {
    this.equipoProp = this.campo;
  },
  methods: {
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
            throw new Error("Error al agregar el tipo de equipo");
          }
        })
        .then((response) => {
          this.tipoEquipoId = response.id;
          this.$emit("tipo-equipo-agregado", this.tipoEquipoId);
        })
        .catch((error) => {
          console.error("Error al agregar el tipo de equipo:", error);
        });
    },

    // actualizarSeleccion(selectedTipoEquipo, selectedMarca) {
    //   this.tipoEquipo= selectedTipoEquipo;
    //   this.marca = selectedMarca;
    // },

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
            throw new Error("Error al agregar la marca");
          }
        })
        .then((response) => {
          this.marcaId = response.id;
          this.$emit("marca-agregada", this.marcaId);
        })
        .catch((error) => {
          console.error("Error al agregar la marca:", error);
        });
    },
    handleOk(bvModalEvent) {
      if(this.propName || this.propName.trim() !=""){
      const propExist = this.allProp.find(
        (prop) => prop.nombre == this.propName.toLowerCase()
      );
      if (propExist) {
        this.exist = true;
        bvModalEvent.preventDefault();
      } 
      
      else {
        this.exist = false;
      }}else if(!this.propName || this.propName.trim() ==""){
        this.exist = true;
      }
    },

    addModelo(propName) {
      console.log(this.allProp);
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
          console.error("Error al agregar el modelo:", error);
        });
    },

    submitForm(bvModalEvent) {
      this.handleOk(bvModalEvent);
      if (!this.exist) {
        const propiedadName = {
          nombre: this.propName,
        };
        this.addProp(propiedadName);
        this.modalShow = false;
        this.resetModal();
      }
    },
    resetModal() {
      this.propName = null;
    },
  },
};
</script>
