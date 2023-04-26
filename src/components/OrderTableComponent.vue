<template>
  <div id="divOrderTable">
    <b-table responsive :items="items" :striped="striped" :fields="fields" bordered scrollX >
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
    </b-table>

    <!-- <b-table striped hover :items="items"></b-table> -->
  </div>
</template>

<script>
export default {
  name: "OrderTableComponent",

  methods: {
    async loadAPI() {
      this.toggleBusy()
      const response = await fetch("https://635088ad3e9fa1244e483b3c.mockapi.io/OrderList");
      const jsonData = await response.json();
      this.items = (jsonData);
      this.toggleBusy()
      console.log(jsonData)
    },
    toggleBusy() {
        this.isBusy = !this.isBusy
      }
  },
  beforeMount() {
    this.loadAPI()
  },
  data() {
    return {
      isBusy: false,
      fields: ['id','clienteNombre', 'equipoMarca', 'equipoModelo','falla'],
      items: [],
    };
  },
};



</script>

<style scoped>
#divOrderTable {
  min-width: 360px;
}

.tabla {
  max-height:300px;
  overflow-x: scroll !important;
  overflow-y: scroll !important;
}
</style>
