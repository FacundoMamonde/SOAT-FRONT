<template>
   <div class="d-flex flex-column h-100">
    <HeaderComponent :buscadorOrdenes="true"></HeaderComponent>
    <NavComponent></NavComponent>
    <b-row class="flex-grow-1" >
      <b-col sm="6" lg="7"  class="flex-grow-1" >
        <OrderTableComponent  class="flex-grow-1" :estado="5"></OrderTableComponent>
      </b-col>
      <b-col sm="6" lg="5" class="flex-grow-1">
        <OrderDetailComponent class="flex-grow-1" ></OrderDetailComponent>
      </b-col>
    </b-row>
    <FooterComponent></FooterComponent>
  </div>
</template>

<script>

import OrderTableComponent from "@/components/OrderTableComponent.vue";
import NavComponent from "@/components/NavComponent.vue";
import OrderDetailComponent from "@/components/OrderDetailComponent.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
export default {
  name: "EntregadasView",
  components:{OrderTableComponent,NavComponent,OrderDetailComponent,HeaderComponent,FooterComponent}
};
</script>
