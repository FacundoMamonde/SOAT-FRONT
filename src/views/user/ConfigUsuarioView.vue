<template>
    <div>
      <HeaderComponent></HeaderComponent>
      <ConfigUsuarioComponent></ConfigUsuarioComponent>
    </div>
  </template>
  
  <script>

  import HeaderComponent from "@/components/HeaderComponent.vue";
  import ConfigUsuarioComponent from "@/components/user/ConfigUsuario.vue";
  
  export default {
    name: "ConfigUsuarioView",
  
    components:{HeaderComponent, ConfigUsuarioComponent}
  };
  </script>
  
  