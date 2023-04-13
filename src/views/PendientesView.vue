<template>
  <div>
     <HeaderComponent></HeaderComponent>
     <NavComponent></NavComponent>
     <div id="divOrderContainer">
        <OrderTableComponent></OrderTableComponent>
      <OrderDetailComponent class="px-3"></OrderDetailComponent>
    </div>
  </div>
</template>

<script>
import NavComponent from '@/components/NavComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import OrderDetailComponent from '@/components/OrderDetailComponent.vue';
import OrderTableComponent from '@/components/OrderTableComponent.vue';


export default {
  name: 'PendientesView',
  components: { OrderDetailComponent, OrderTableComponent, HeaderComponent, NavComponent }
}
</script>
<style : scoped>
</style>
