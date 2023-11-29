<template>
  <div id="agregar">
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-group
        label="Nombre y apellido(*)"
        label-for="name-input"
        invalid-feedback="El nombre es requerido"
        :state="nameState"
      >
        <b-form-input
          id="name-input"
          v-model="nombre"
          :state="nameState"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        label="Telefono (*)"
        label-for="phone-input"
        invalid-feedback="El telefono es requerido"
        :state="phoneState"
        ref="phoneInput"
      >
        <b-form-input
          id="phone-input"
          v-model="telefono"
          :state="phoneState"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="dniGroup"
        label="DNI"
        label-for="dniInput"
        :state="dniState"
      >
        <b-form-input
          id="dniInput"
          v-model="dni"
          :state="dniState"
          type="number"
        ></b-form-input>
        <b-form-invalid-feedback :state="dniState">
          Debe tener menos de 10 digitos.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        id="descriptionGroup"
        label="Descripción"
        label-for="descriptionInput"
      >
        <b-form-textarea
          id="descriptionInput"
          v-model="description"
          required
        ></b-form-textarea>
      </b-form-group>
    </form>
    <b-alert class="mt-3" show variant="primary" v-if="isBusy == true">
      <b-spinner class="ms-1 me-1" small variant="primary"></b-spinner>
      Procesando solicitud...
    </b-alert>
  </div>
</template>

<script>
import { bus, backendData } from "../main";
export default {
  name: "ClientForm",

  props: {
    cliente: {
      type: Object,
      required: false,
    },
    modo: String,
  },

  data() {
    return {
      isBusy: false,
      nameState: null,
      phoneState: null,
      dniState: null,
      nombre: "",
      telefono: "",
      dni: null,
      description: null,
      errorText: "",
      selectedClientId: null,
      selectClient: null,
    };
  },

  beforeMount() {
    if (this.modo === "editar" && this.cliente) {
      this.nombre = this.cliente.nombre;
      this.telefono = this.cliente.telefono;
      this.dni = this.cliente.dni;
      this.descripcion = this.cliente.descripcion;
    }
  },
  methods: {
    addClient(client) {
      this.isBusy = true;
      fetch(`${backendData}/cliente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error al agregar el cliente");
          }
        })
        .then((response) => {
          this.selectedClientId = response.id;
          bus.$emit("cliente-agregado", this.selectedClientId);
          this.$emit("cliente-actualizado");
          this.isBusy = false;
          this.$nextTick(() => {
            this.$bvModal.hide("modal-cliente");
          });
        })
        .catch((error) => {
          console.error("Error al agregar el cliente:", error);
        });
    },

    updateClient(client) {
      this.isBusy = true;
      fetch(`${backendData}/cliente/${this.cliente.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error al actualizar el cliente");
          }
        })
        .then((response) => {
          console.log(`Cliente con ID ${response.id} actualizado`);
          this.$emit("cliente-actualizado");
          this.isBusy = false;
          this.$nextTick(() => {
            this.$bvModal.hide("modal-editar");
          });
        })
        .catch((error) => {
          console.error("Error al actualizar el cliente:", error);
        });
    },

    checkFormValidity() {
      this.nameState = this.nombre.length > 0;
      this.phoneState = this.telefono.length > 0;
      if (this.dni !==null) {
        if (this.dni.toString().length < 10) this.dniState = true;
        else this.dniState = false;
      } else {
        this.dniState = null;
        this.dni = null;

      }
    },
    
    handleSubmit() {
      this.checkFormValidity();
      if (!this.nameState || !this.phoneState || this.dniState==false) {
        return;
      }
      if (
        this.dni === null ||
        (typeof this.dni === "string" && this.dni.trim() === "")
      ) {
        this.dni = null;
      }
      const createClientDto = {
        nombre: this.nombre,
        telefono: this.telefono,
        dni: this.dni,
        descripcion: this.description,
      };
      if (this.modo === "agregar") {
        this.addClient(createClientDto);
      } else {
        this.updateClient(createClientDto);
      }
    },
  },
};
</script>
