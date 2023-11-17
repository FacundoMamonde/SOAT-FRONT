<template>
    <div>
        <HeaderComponent :buscadorOrdenes="true"></HeaderComponent>

        <NavComponent></NavComponent>
        <div id="divOrderContainer">
            <OrderTableComponent :estado="6"></OrderTableComponent>
            <OrderDetailComponent :nextButton="'Restaurar Orden'"></OrderDetailComponent>
        </div>
    </div>
</template>
  
<script>

import OrderTableComponent from '@/components/OrderTableComponent.vue';
import NavComponent from '@/components/NavComponent.vue';
import OrderDetailComponent from '@/components/OrderDetailComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
export default {
    name: 'EliminadasView',
    components: { OrderTableComponent, NavComponent, OrderDetailComponent, HeaderComponent }
}
</script>
<style:scope>
  .nav{
    background-color: #949494;
  }
  </style>