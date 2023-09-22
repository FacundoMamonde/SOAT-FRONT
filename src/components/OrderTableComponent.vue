<template>
  <div id="divOrderTable" class="px-md-3">
    <div class="d-flex flex-column h-100">
      <div class="flex-grow-1">
        <b-table
          id="table"
          responsive
          :items="ordenes"
          striped
          :fields="fields"
          class="text-muted tabla"
          :per-page="perPage"
          :current-page="currentPage"
          ref="selectableTable"
          selectable
          @row-selected="onRowSelected"
          :select-mode="selectMode"
          :selected.sync="selectedRow"
          :borderless="true"
        >
          <template #head()="data">
            <span class="text">{{ data.label }}</span>
          </template>
          <template #cell()="data">
            <span class="text-secondary">{{ data.value }}</span>
          </template>
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
        </b-table>
      </div>
      <div class="mt-3">
        <b-pagination
          size="sm"
          align="center"
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="table"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "../main";

export default {
  name: "OrderTableComponent",
  data() {
    return {
      perPage: 12,
      currentPage: 1,
      isBusy: false,
      fields: [
        { key: "id", label: "ID" },
        { key: "nombre", label: "Cliente" },
        { key: "marca", label: "Equipo Marca" },
        { key: "", label: "Equipo Modelo" },
        { key: "falla", label: "Falla" },
      ],
      filtro: "",
      items: [],
      selectMode: "range",
      selectedRow: null,
      ordenes: [],
      clientes: [],
      equipos: [],
    };
  },
  props: {
    estado: {
      type: Number,
      default: null,
    },
  },
  watch: {
    filtro() {
      this.selectFirstRow();
    },
    currentPage() {
      this.selectFirstRow();
    },
  },

  created() {
    bus.$on("cambiar-estado", () => {
      this.fetchData();
      this.fillTableData();
    });
    bus.$on("orden-agregada", () => {
      this.fetchData();
      this.fillTableData();
    });

    this.fetchData();
  },
  methods: {
    async fetchData() {
      fetch(`http://localhost:3000/ordenes/${this.estado}`)
        .then((response) => response.json())
        .then((ordenes) => {
          this.ordenes = ordenes;
          this.fillTableData();
          this.selectFirstRow();
        })
        .catch((error) => {
          console.error("Error al obtener las ordenes:", error);
        });
    },
    fillTableData() {
      this.items = this.ordenes.map((orden) => ({
        id: orden.id,
        falla: orden.falla,
        nombre: orden.nombre,
        modelo: orden.modelo,
        marca: orden.marca,
        estado: orden.estado,
      }));
    },

    onRowSelected(ordenes) {
      if (ordenes.length > 0) {
        const orderID = ordenes[0].id;
        bus.$emit("row-selected", orderID);
      }
    },
    selectFirstRow() {
      this.$nextTick(() => {
        this.$refs.selectableTable.selectRow(0);
      });
    },
    toggleBusy() {
      this.isBusy = !this.isBusy;
    },
  },
  async beforeMount() {
    this.selectFirstRow();
    bus.$on("filtro-cambiado", (filtro) => {
      this.filtro = filtro.filtro;
      this.filtroPor = filtro.filtroPor;
    });
  },

  computed: {
    rows() {
      return this.ordenes.length;
    },
    itemsFiltrados() {
      if (!this.filtro) {
        return this.items.filter((item) => item.estado === this.estado);
      }
      return this.items.filter((item) => {
        const inputFiltro =
          this.filtroPor === "cliente"
            ? item.clienteNombre
                .toLowerCase()
                .includes(this.filtro.toLowerCase())
            : item.equipoMarca
                .toLowerCase()
                .includes(this.filtro.toLowerCase());
        return inputFiltro && item.estado === this.estado;
      });
    },
  },
};
</script>

<style scoped>
#divOrderTable {
  min-width: 360px;
}

.tabla {
  max-height: 600px;
  white-space: nowrap;
}
.tabla::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.tabla::-webkit-scrollbar-thumb {
  background-color: #6c757d;
  border-radius: 5px;
}

.tabla::-webkit-scrollbar-track {
  background-color: transparent;
}

.tabla {
  max-height: 600px;
  overflow-x: scroll !important;

  white-space: nowrap;
  scrollbar-width: thin;
  scrollbar-color: #6c757d transparent;
}

.text {
  color: #6a6a6b;
}

.tabla::-webkit-scrollbar-thumb {
  background-color: #6c757d;
  border-radius: 5px;
}

.tabla::-webkit-scrollbar-track {
  background-color: transparent;
}

.tabla {
  max-height: 600px;
  overflow-x: scroll !important;

  white-space: nowrap;
  scrollbar-width: thin;
  scrollbar-color: #6c757d transparent;
}

.text {
  color: #6a6a6b;
}
</style>
