<template>
  <div>
    <HeaderComponent></HeaderComponent>
    <NavComponent></NavComponent>
    <div id="divOrderContainer">
      <OrderTableComponent :estado="1"></OrderTableComponent>
      <OrderDetailComponent></OrderDetailComponent>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import OrderDetailComponent from '@/components/OrderDetailComponent.vue';
import OrderTableComponent from '@/components/OrderTableComponent.vue';
import NavComponent from '@/components/NavComponent.vue';
export default {
  name: 'TerminadasView',
  components: { OrderDetailComponent, OrderTableComponent, HeaderComponent,NavComponent }
}
</script>
<style:scope>
.nav{
  background-color: #949494;

}</style>
