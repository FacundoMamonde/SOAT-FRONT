<template>
  <div>
    <b-modal
      id="equiposModal"
      v-model="modalShow"
      :title="`Nuevo ${this.equipoProp}`"
      @ok="submitForm"
      @hidden="resetModal"
    >
      <div class="modal-body d-flex flex-column">
        <b-form-group
          label=""
          :label-for="equipoProp"
          :invalid-feedback="errorMessage"
          :state="propState"
        >
          <b-input
            id="equipoProp"
            v-model="propName"
            type="text"
            :placeholder="equipoProp"
            :state="propState"
          />
        </b-form-group>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { backendData } from "../main";

export default {
  name: "NewEquipoComponent",
  props: {
    campo: String,
    // allProp: Array,
  },
  data() {
    return {
      modalShow: false,
      equipoProp: this.campo,
      propName: null,
      propState: null,
      errorMessage: "",
      allProp: [],
    };
  },
  methods: {
    abrirModal(campo, allProp) {
      this.equipoProp = campo;
      this.allProp = allProp;
      console.log(this.equipoProp);
      console.log(this.allProp);
    },

    async addProp(propName) {
      if (this.equipoProp === "Tipo de equipo") {
        await this.addEntity(
          "tipo-equipo",
          propName,
          "tipo-equipo-agregado",
          "tipoEquipoId"
        );
      } else if (this.equipoProp === "Marca") {
        await this.addEntity("marca", propName, "marca-agregada", "marcaId");
      } else if (this.equipoProp === "Modelo") {
        const createModeloDto = {
          nombre: propName.nombre,
          marcaID: this.selectedMarca.id,
          tipoEquipoID: this.selectedTipoEquipo.id,
        };
        await this.addEntity(
          "modelo",
          createModeloDto,
          "modelo-agregado",
          "modeloId"
        );
      }
      this.modalShow = false;
      this.resetModal();
    },

    async addEntity(endpoint, data, eventName, idField) {
      try {
        const response = await fetch(`${backendData}/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const responseData = await response.json();
          this[idField] = responseData.id;
          this.$emit(eventName, this[idField]);
        } else {
          throw new Error(`Error al agregar ${this.equipoProp}`);
        }
      } catch (error) {
        console.error(`Error al agregar ${this.equipoProp}:`, error);
        throw error;
      }
    },

    actualizarSeleccion(selectedTipoEquipo, selectedMarca) {
      this.selectedTipoEquipo = selectedTipoEquipo;
      this.selectedMarca = selectedMarca;
    },

    handleOk(bvModalEvent) {
      if (this.propName && this.propName.trim() !== "") {
        const nombre = this.propName.trim().toLowerCase();
        if (this.allProp.some((prop) => prop.nombre.toLowerCase() === nombre)) {
          this.propState = false;
          this.errorMessage = "Ya existe un registro con este nombre.";
          bvModalEvent.preventDefault();
        } else {
          this.propState = true;
        }
      } else {
        this.propState = false;
        this.errorMessage = "Debe completar este campo";
        bvModalEvent.preventDefault();
      }
    },

    submitForm(bvModalEvent) {
      this.handleOk(bvModalEvent);
      if (this.propState) {
        const propertyName = {
          nombre: this.propName,
        };
        this.addProp(propertyName);
      }
    },

    resetModal() {
      this.propName = null;
      this.propState = null;
      this.$emit("cerrar-modal-equipo");
    },
  },
};
</script>
<style></style>
