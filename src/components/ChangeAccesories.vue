<template>
  <div>
    <b-button
      v-b-modal.changeAccesories
      variant="transparent"
      class="btn btn-sm"
      ><i class="bi bi-pencil"></i
    ></b-button>
    <b-modal
      id="changeAccesories"
      size="sm"
      title="Accesorios"
      @ok="changeAccesories"
    >
      <textarea v-model="newAccesorio" class="w-100"></textarea>
    </b-modal>
  </div>
</template>

<script>
import { backendData } from "../main";
export default {
  name: "ChangeAccesories",
  props: {
    orden: {
      type: Object,
      default: null,
    },
  },
  
  data() {
    return {
      newAccesorio: this.orden.accesorio,
    };
  },

  methods: {
    changeAccesories() {
      const newData = {
        accesorio: this.newAccesorio,
        id_cliente: this.orden.cliente.id,
        id_equipo: this.orden.equipo.id,
      };
      fetch(`${backendData}/orden/${this.orden.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      })
        .then((response) => {
          if (response.ok) {
            this.$emit("accesorioCambiado", this.newAccesorio);
            return response.text();
          } else {
            throw new Error(
              "Error al actualizar el accesorio: " + response.status
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
