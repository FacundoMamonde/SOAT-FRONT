<template>
  <div id="divOrderTable" class="px-md-0">
    
      <div v-if="isBusy" class="text-center h-100 d-flex align-items-center justify-content-center">
        <b-spinner  variant="primary"></b-spinner>
      
    </div>
    <div v-else class="d-flex flex-column h-100 ">
      <div class="flex-grow-1 container pe-0 ps-0" v-show="ordenes.length > 0">
        <b-table id="table" class="text-muted tabla" responsive :items="ordenes" striped :fields="fields" 
          :per-page="perPage" :current-page="currentPage" ref="selectableTable" :selectable="selectable" @row-selected="onRowSelected"
          :select-mode="selectMode" :selected.sync="selectedRow"  label-sort-asc="" label-sort-desc=""
          label-sort-clear="" > <!-- borderless="true" -->
          <template #head()="data">
            <span class="text">{{ data.label }}</span>
          </template>
          <template #cell()="data">
            <td :class="{ 'selected-row': data.item === selectedRow }">
        <span class="text-secondary">{{ data.value }}</span>
      </td>
          </template>
        </b-table>
        <div class="d-flex justify-content-center ">
          <b-pagination size="sm" v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
            aria-controls="table"></b-pagination>
        </div>
      </div>
      <div v-if="ordenes.length <= 0" class="h-100 d-flex align-items-center justify-content-center">
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
      isBusy:false,
      fields: [
        { key: "id", label: " #" ,sortable: true},
        { key: "nombre", label: "Cliente" ,sortable: true},
        { key: "marca", label: "Marca" ,sortable: true},
        { key: "modelo", label: "Modelo" ,sortable: true},
        { key: "falla", label: "Falla" ,sortable: true},
      ],
      filtro: "",
      items: [],
      selectMode: "range",
      selectedRow: null,
      ordenes: [],
      totalRows: null,
      selectable: true,
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
    });
    bus.$on("orden-agregada", () => {
      this.fetchData();
    });
    bus.$on("order-data-loaded", () => {
      this.selectable= true;
    });

    this.fetchData();
  },

  methods: {

    updateTotalRows() {
      this.totalRows = this.ordenes.length;
    },
    async fetchData() {
      this.toggleBusy() // TESTEANDO
      fetch(`${backendData}/ordenes/getall/${this.estado}`)
        .then((response) => response.json())
        .then((ordenes) => {
          this.toggleBusy() // TESTEANDO
          this.ordenes = ordenes;
          this.totalRows = this.ordenes.length
          // this.selectFirstRow();
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

    onRowSelected(ordenes) {
      this.ordenes.forEach((orden) => {
    orden._rowVariant = null;
  });
      if (ordenes.length == 0) {
        this.selectedRow=null
        bus.$emit("no-order-selected",this.orderData=null);
     } else {
        this.selectedRow=ordenes[0];
       this.selectedRow._rowVariant = 'active';
        bus.$emit("row-selected", this.selectedRow.id);
        this.selectable = false;
      }
    },

    // selectFirstRow() {
    //   if (this.$refs.selectableTable && this.ordenes.length > 0) {
    //     this.$nextTick(() => {
    //       this.$refs.selectableTable.selectRow(0);
    //     });
    //   }
    // },

    toggleBusy() {
      this.isBusy = !this.isBusy;
    },

    async itemsFiltrados() {
      this.toggleBusy() // TESTEANDO
      fetch(`${backendData}/ordenes/filter/${this.estado}?filtro=${this.filtro}&filtroPor=${this.filtroPor}`)
        .then((response) => response.json())
        .then((ordenes) => {
          this.toggleBusy() // TESTEANDO
          this.ordenes = ordenes;
          this.totalRows = this.ordenes.length;
         
          // this.currentPage = 1;
          // if (ordenes.length > 0) {
          //   this.selectFirstRow();
          // }
        })
        .catch((error) => {
          console.error("Error al obtener las ordenes:", error);
        });
    },
  },
  async beforeMount() {
    // this.selectFirstRow();
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
  color: #161616;
}

.text-secondary {
  color: rgb(36, 36, 36)
}

.tabla::-webkit-scrollbar-thumb {
  background-color: #505050;
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

#divOrderTable {
  border-right: 2px solid #cecece;
  color: blacks
}
</style>

