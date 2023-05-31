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
      dataClient: [],
      mergedItems: [],
      selectMode: "range",
      selectedRow: null,
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
  methods: {
    onRowSelected(items) {
      if (items && items.length > 0) {
        const item = items[0];
        this.selectedRow = item;
        const equipo = this.items.find((item2) => item2.id === item.id);
        const cliente = this.dataClient.find(
          (item2) => item2.id === String(item.clientID)
        );
        bus.$emit("row-selected", cliente, equipo);
      }
    },
    selectFirstRow() {
      this.$nextTick(() => {
        this.$refs.selectableTable.selectRow(0);
      });
    },
    async loadData() {
      this.toggleBusy();
      await Promise.all([this.loadAPI(), this.loadAPIClient()]);
      this.toggleBusy();
    },
    async loadAPI() {
      this.toggleBusy();
      const response = await fetch(
        "https://635088ad3e9fa1244e483b3c.mockapi.io/OrderList"
      );
      const jsonData = await response.json();
      this.items = jsonData;
      this.toggleBusy();
      this.mergeItems();
    },
    async loadAPIClient() {
      fetch("https://635088ad3e9fa1244e483b3c.mockapi.io/clients/")
        .then((response) => response.json())
        .then((data) => {
          this.dataClient = data;
          this.mergeItems();
        });
    },
    toggleBusy() {
      this.isBusy = !this.isBusy;
    },
    mergeItems() {
      if (this.items.length > 0 && this.dataClient.length > 0) {
        this.mergedItems = this.items.map((item1) => {
          const matchingItem = this.dataClient.find(
            (item2) => item2.id === String(item1.clientID)
          );
          if (matchingItem) {
            item1.clienteNombre = matchingItem.name;
          } else {
            item1.clienteNombre = "Sin datos";
          }

          return item1;
        });
      }
    },
  },
  async beforeMount() {
    this.loadAPI();
    this.loadAPIClient();
    await this.loadData();
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
        return this.mergedItems.filter((item) => item.estado === this.estado);
      }
      const filtroMinusculas = this.filtro.toLowerCase();
      return this.mergedItems.filter((item) => {
        const cumpleFiltro =
          this.filtroPor === "cliente"
            ? item.clienteNombre.toLowerCase().includes(filtroMinusculas)
            : item.equipoMarca.toLowerCase().includes(filtroMinusculas);
        return cumpleFiltro && item.estado === this.estado;
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
</style>
