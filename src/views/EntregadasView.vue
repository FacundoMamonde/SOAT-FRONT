<template>
  <div>
    <h1>ENTREGADAS</h1>
    <HeaderComponent></HeaderComponent>
    <div id="divOrderContainer">
      <OrderTableComponent></OrderTableComponent>
      <OrderDetailComponent></OrderDetailComponent>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import OrderDetailComponent from '@/components/OrderDetailComponent.vue';
import OrderTableComponent from '@/components/OrderTableComponent.vue';

export default {
  name: 'EntregadasView',
  components: { OrderDetailComponent, OrderTableComponent, HeaderComponent }
}
</script>
