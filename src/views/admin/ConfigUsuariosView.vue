<template>
  <div class="d-flex flex-column h-100">
    <HeaderComponent></HeaderComponent>
    <ConfigUsuariosComponent class="flex-grow-1"></ConfigUsuariosComponent>
    <FooterComponent></FooterComponent>
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import ConfigUsuariosComponent from "@/components/admin/ConfigUsuarios.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  name: "ConfigUsuariosView",
  components: { HeaderComponent, ConfigUsuariosComponent, FooterComponent },
};
</script>
