<template>
  <div>
    <!-- <HeaderComponent></HeaderComponent>
     -->
     <NavComponent></NavComponent>
    <div id="divOrderContainer">
      <OrderTableComponent :estado="1"></OrderTableComponent>
       <OrderDetailComponent></OrderDetailComponent>
    </div> 
  </div>
</template>

<script>

import OrderTableComponent from '@/components/OrderTableComponent.vue';
import NavComponent from '@/components/NavComponent.vue';
import OrderDetailComponent from '@/components/OrderDetailComponent.vue';
export default {
  name: 'TerminadasView',
  components: {OrderTableComponent,NavComponent,OrderDetailComponent}
  // components: { OrderDetailComponent, OrderTableComponent, HeaderComponent,NavComponent }
}
</script>
<style:scope>
.nav{
  background-color: #949494;
}
</style>