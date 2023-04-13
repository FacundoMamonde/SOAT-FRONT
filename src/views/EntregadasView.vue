<template>
  <div>
    <HeaderComponent></HeaderComponent>
    <NavComponent></NavComponent>
    <div id="divOrderContainer">
      <OrderTableComponent></OrderTableComponent>
      <OrderDetailComponent></OrderDetailComponent>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import OrderDetailComponent from "@/components/OrderDetailComponent.vue";
import OrderTableComponent from "@/components/OrderTableComponent.vue";
import NavComponent from "@/components/NavComponent.vue";
export default {
  name: "EntregadasView",
  components: {
    OrderDetailComponent,
    OrderTableComponent,
    HeaderComponent,
    NavComponent,
  },
};
</script>
