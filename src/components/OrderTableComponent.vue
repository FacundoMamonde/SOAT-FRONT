<template>
  <div id="divOrderTable">
    <b-table striped hover :items="items"></b-table>
  </div>
</template>

<script>
export default {
  name: "OrderTableComponent",
  data() {
    return {
      items: [
        {
          ID: 1,
          Cliente: "Dickerson",
          Marca: "Phillips",
          Modelo: "asd213",
          Falla: "no prende",
        },
        {
          ID: 2,
          Cliente: "Larsen",
          Marca: "LG",
          Modelo: "ghj567",
          Falla: "instalar photoshop",
        },
        {
          ID: 3,
          Cliente: "Geneva",
          Marca: "Samsung",
          Modelo: "qwe123",
          Falla: "no imprime",
        },
        {
          ID: 4,
          Cliente: "Jami",
          Marca: "Apple",
          Modelo: "poi324",
          Falla: "no tiene espacio",
        },
      ],
    };
  },
};
</script>

<style scoped>
#divOrderTable {
  min-width: 360px;
}
</style>
