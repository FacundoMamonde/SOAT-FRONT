<template>
  <div v-if="getUserAdmin() && orden.estado < 6">
    <b-button variant="danger" v-b-modal.modal-eliminar>
      <i class="bi bi-trash"></i>
    </b-button>
    <b-modal
      id="modal-eliminar"
      title="Eliminar orden"
      size="sm"
      @ok="deleteOrder(orden.id)"
    >
      <div>
        <p class="my-4">
          ¿Seguro que desea eliminar la orden {{ this.order.id }} ?
        </p>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { bus, backendData } from "../main";
export default {
  name: "DeleteOrder",
  props: {
    orden: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      order: this.orden,
    };
  },

  methods: {
    deleteOrder(orderId) {
      fetch(`${backendData}/orden/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("La orden se ELIMINO correctamente");
            this.$emit("orden-eliminada");
            bus.$emit("orden-eliminada");
            this.order = null;
          } else {
            console.error("Error al eliminar la orden:", response.status);
          }
        })
        .catch((error) => {
          console.error("Error en la llamada a la API:", error);
        });
    },
    getUserAdmin() {
      this.admin = localStorage.getItem("role");
      if (this.admin !== "admin") {
        return false;
      }
      return true;
    },
  },
};
</script>
