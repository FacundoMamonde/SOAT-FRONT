<template>
  <div>
    <HeaderComponent></HeaderComponent>
     
     <NavComponent></NavComponent>
     <div id="divOrderContainer">
        <OrderTableComponent :estado="3"></OrderTableComponent>
       <OrderDetailComponent :nextButton="'A terminada'" ></OrderDetailComponent>
    </div> 
  </div>
</template>

<script>

import OrderTableComponent from '@/components/OrderTableComponent.vue';
import NavComponent from '@/components/NavComponent.vue';
import OrderDetailComponent from '@/components/OrderDetailComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
export default {
  name: 'PendientesView',
  // components: { OrderDetailComponent, OrderTableComponent, HeaderComponent, NavComponent },
  components: {OrderTableComponent,NavComponent,OrderDetailComponent,HeaderComponent}
}
</script>
<style : scoped>
</style>
