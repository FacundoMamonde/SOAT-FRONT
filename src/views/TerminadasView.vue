<template>
  <div>
    <HeaderComponent></HeaderComponent>
    
     <NavComponent></NavComponent>
    <div id="divOrderContainer">
      <OrderTableComponent :estado="4"></OrderTableComponent>
       <OrderDetailComponent :nextButton="'Entregada'"></OrderDetailComponent>
    </div> 
  </div>
</template>

<script>

import OrderTableComponent from '@/components/OrderTableComponent.vue';
import NavComponent from '@/components/NavComponent.vue';
import OrderDetailComponent from '@/components/OrderDetailComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
export default {
  name: 'TerminadasView',
  components: {OrderTableComponent,NavComponent,OrderDetailComponent, HeaderComponent}
  // components: { OrderDetailComponent, OrderTableComponent, HeaderComponent,NavComponent }
}
</script>
<style:scope>
.nav{
  background-color: #949494;
}
</style>