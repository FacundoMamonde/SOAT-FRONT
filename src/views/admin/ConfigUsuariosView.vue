<template>
    <div>
      <HeaderComponent></HeaderComponent>
      <ConfigUsuariosComponent></ConfigUsuariosComponent>
    </div>
  </template>
  
  <script>

  import HeaderComponent from "@/components/HeaderComponent.vue";
  import ConfigUsuariosComponent from "@/components/admin/ConfigUsuarios.vue";
  
  export default {
    name: "ConfigUsuariosView",
  
    components:{HeaderComponent, ConfigUsuariosComponent}
  };
  </script>
  
  