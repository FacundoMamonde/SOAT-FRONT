<template>
  <div class="d-flex flex-column h-100">
    <HeaderComponent></HeaderComponent>
    <ClientesComponent class="flex-grow-1"></ClientesComponent>
    <FooterComponent></FooterComponent>
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import ClientesComponent from "@/components/ClientesComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
export default {
  name: "ClientesView",
  components: { HeaderComponent, ClientesComponent, FooterComponent },
};
</script>
