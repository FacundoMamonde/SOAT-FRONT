<template>
    <div>
      <HeaderComponent></HeaderComponent>
      <ConfigNegocioComponent></ConfigNegocioComponent>
    </div>
  </template>
  
  <script>

  import HeaderComponent from "@/components/HeaderComponent.vue";
  import ConfigNegocioComponent from "@/components/admin/ConfigNegocio.vue";
  
  export default {
    name: "ConfigNegocioView",
  
    components:{HeaderComponent, ConfigNegocioComponent}
  };
  </script>
  