<template>
  <div id="divOrderTable" class="px-md-3">
    <div class="d-flex flex-column h-100">
      <div class="flex-grow-1">
        <b-table
          id="table"
          responsive
          :items="itemsFiltrados"
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
        { key: "clienteNombre", label: "Cliente" },
        { key: "equipoMarca", label: "Equipo Marca" },
        { key: "equipoModelo", label: "Equipo Modelo" },
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
    fetchData() {
      Promise.all([
        fetch("http://localhost:3000/cliente/"),
        fetch("http://localhost:3000/equipo/"),
        fetch("http://localhost:3000/orden/"),
      ])
        .then(([response1, response2, response3]) =>
          Promise.all([response1.json(), response2.json(), response3.json()])
        )
        .then(([clientes, equipos, ordenes]) => {
          this.clientes = clientes;
          this.equipos = equipos;
          this.ordenes = ordenes;
          this.fillTableData();
          this.selectFirstRow();
        })
        .catch((error) => {
          console.error("Error al obtener los datos:", error);
        });
    },
    fillTableData() {
      this.items = this.ordenes.map((orden) => {
        let orderData = this.ordenes.find((order) => order.id === orden.id);
        let cliente = this.clientes.find((c) => c.id === orderData.clienteID);
        let equipo = this.equipos.find((e) => e.id === orderData.equipoID);
        return {
          id: orden.id,
          clienteNombre: cliente ? cliente.name : "nombre",
          equipoMarca: equipo ? equipo.marca : "marca de equipo",
          equipoModelo: equipo ? equipo.modelo : "modelo de equipo",
          falla: orden.falla,
          estado: orden.estado,
          equipoID: equipo.id,
          clienteID: cliente.id,
        };
      });
    },
    onRowSelected(items) {
      if (items.length > 0) {
        const orderID = items[0].id;
        const equipoID = items[0].equipoID;
        const clienteID = items[0].clienteID;
        bus.$emit("row-selected", orderID, equipoID, clienteID);
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
      return this.itemsFiltrados.length;
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
