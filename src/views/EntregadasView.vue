<template>
  <div>
    <HeaderComponent :buscadorOrdenes="true"></HeaderComponent>
    <NavComponent></NavComponent>
    <div id="divOrderContainer">
      <OrderTableComponent :estado="5"></OrderTableComponent>
       <OrderDetailComponent></OrderDetailComponent> 
    </div>
  </div>
</template>

<script>

import OrderTableComponent from "@/components/OrderTableComponent.vue";
import NavComponent from "@/components/NavComponent.vue";
import OrderDetailComponent from "@/components/OrderDetailComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
export default {
  name: "EntregadasView",
  // components: {
  //   OrderDetailComponent,
  //   OrderTableComponent,
  //   HeaderComponent,
  //   NavComponent,
  // },
  components:{OrderTableComponent,NavComponent,OrderDetailComponent,HeaderComponent}
};
</script>
