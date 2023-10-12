<template>
  <div id="divOrderTable" class="px-md-3">
    <div class="d-flex flex-column h-100 ">
      <div class="flex-grow-1 container  " v-show="ordenes.length > 0">
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
        <div class="d-flex justify-content-center " >
          <b-pagination 
            size="sm"
            
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            aria-controls="table"
           
          ></b-pagination>
        </div>
      </div>
      <div
        v-if="ordenes.length <= 0"
        class="h-100 d-flex align-items-center justify-content-center"
      >
        <p>No se ha encontrado ninguna orden.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { backendData, bus } from "../main";

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
        { key: "modelo", label: "Equipo Modelo" },
        { key: "falla", label: "Falla" },
      ],
      filtro: "",
      items: [],
      selectMode: "range",
      selectedRow: null,
      ordenes: [],
      totalRows: 0,
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
      bus.$on("filtro-cambiado", (filtro) => {
        this.filtro = filtro.filtro;
        this.filtroPor = filtro.filtroPor;
      });
      this.itemsFiltrados();
    },
    currentPage() {
      this.fetchData();
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
    });

    this.fetchData();
  },

  methods: {
    updateTotalRows() {
      this.totalRows = this.ordenes.length;
    },
    async fetchData() {
      fetch(`${backendData}/ordenes/getall/${this.estado}`)
        .then((response) => response.json())
        .then((ordenes) => {
          this.ordenes = ordenes;
          this.fillTableData();
        })
        .catch((error) => {
          console.error("Error al obtener las ordenes:", error);
        });

      // const page = this.currentPage;
      // const pageSize = this.perPage;

      // const estado = this.estado;

      // Realiza una solicitud al servidor para obtener datos paginados
      /*    fetch(`http://localhost:3000/ordenes/getpaged/${estado}?page=${page}&pageSize=${pageSize}`)
        .then((response) => response.json())
        .then((data) => {
          this.ordenes = data.orders;
          this.totalRows = data.totalRows;
          this.fillTableData()
        })
        .catch((error) => {
          console.error("Error al obtener las ordenes paginadas:", error);
        });*/
    },
    fillTableData() {
      if (this.ordenes) {
        this.ordenes = this.ordenes.map((orden) => ({
          id: orden.id,
          falla: orden.falla,
          nombre: orden.nombre,
          modelo: orden.modelo,
          marca: orden.marca,
          estado: orden.estado,
        }));
        this.selectFirstRow();
      }
    },

    onRowSelected(ordenes) {
      if (ordenes.length > 0) {
        const orderID = ordenes[0].id;
        bus.$emit("row-selected", orderID);
      } else {
        bus.$emit("no-order-selected");
      }
    },

    selectFirstRow() {
      if (this.$refs.selectableTable && this.ordenes.length > 0) {
        this.$nextTick(() => {
          this.$refs.selectableTable.selectRow(0);
        });
      }
    },

    toggleBusy() {
      this.isBusy = !this.isBusy;
    },

    async itemsFiltrados() {
      fetch(
        `${backendData}/ordenes/filter/${this.estado}?filtro=${this.filtro}&filtroPor=${this.filtroPor}`
      )
        .then((response) => response.json())
        .then((ordenes) => {
          this.ordenes = ordenes;
          this.totalRows = this.ordenes.length;
          console.log(this.totalRows);
          this.currentPage = 1;
          this.fillTableData();
        })
        .catch((error) => {
          console.error("Error al obtener las ordenes:", error);
        });
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
      return this.ordenes;
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
