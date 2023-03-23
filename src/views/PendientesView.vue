<template>
  <div>
    <h1>PENDIENTES</h1>
    <OrderTableComponent></OrderTableComponent>
    <OrderDetailComponent></OrderDetailComponent>
  </div>
</template>

<script>
import OrderDetailComponent from '@/components/OrderDetailComponent.vue';
import OrderTableComponent from '@/components/OrderTableComponent.vue';

export default {
  name: 'PendientesView',
  components: { OrderDetailComponent, OrderTableComponent }
}
</script>
