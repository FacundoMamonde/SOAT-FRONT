<template>
  <div>
    <h1>ENTREGADAS</h1>

    <OrderTableComponent></OrderTableComponent>
    <OrderDetailComponent></OrderDetailComponent>
  </div>
</template>

<script>

import OrderDetailComponent from '@/components/OrderDetailComponent.vue';
import OrderTableComponent from '@/components/OrderTableComponent.vue';

export default {
  name: 'EntregadasView',
  components: { OrderDetailComponent, OrderTableComponent }
}
</script>
