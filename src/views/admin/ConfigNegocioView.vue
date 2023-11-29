<template>
  <div class="d-flex flex-column h-100">
    <HeaderComponent></HeaderComponent>
    <ConfigNegocioComponent class="flex-grow-1"></ConfigNegocioComponent>
    <FooterComponent></FooterComponent>
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import ConfigNegocioComponent from "@/components/admin/ConfigNegocio.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  name: "ConfigNegocioView",
  components: { HeaderComponent, ConfigNegocioComponent, FooterComponent },
};
</script>
