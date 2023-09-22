<template>
  <div>
   <!--  <HeaderComponent></HeaderComponent>
     <NavComponent></NavComponent> -->
     <NavComponent></NavComponent>
     <div id="divOrderContainer">
        <OrderTableComponent :estado="0"></OrderTableComponent>
       <OrderDetailComponent ></OrderDetailComponent>
    </div> 
  </div>
</template>

<script>

import OrderTableComponent from '@/components/OrderTableComponent.vue';
import NavComponent from '@/components/NavComponent.vue';
import OrderDetailComponent from '@/components/OrderDetailComponent.vue';
export default {
  name: 'PendientesView',
  // components: { OrderDetailComponent, OrderTableComponent, HeaderComponent, NavComponent },
  components: {OrderTableComponent,NavComponent,OrderDetailComponent}
}
</script>
<style : scoped>
</style>
