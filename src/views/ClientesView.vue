<template>
    <div>
      <HeaderComponent></HeaderComponent>
      <ClientesComponent></ClientesComponent>
    </div>
  </template>
  
  <script>

  import HeaderComponent from "@/components/HeaderComponent.vue";
  import ClientesComponent from "@/components/ClientesComponent.vue";
  export default {
    name: "ClientesView",
  
    components:{HeaderComponent, ClientesComponent}
  };
  </script>
  