<template>
    <div>
      <HeaderComponent :buscadorOrdenes="true"></HeaderComponent>
      <NavComponent></NavComponent>
      <div id="divOrderContainer">
        <OrderTableComponent :estado="2"></OrderTableComponent>
         <OrderDetailComponent :nextButton="'Aprobado'"></OrderDetailComponent> 
      </div>
    </div>
  </template>
  
  <script>
  
  import OrderTableComponent from "@/components/OrderTableComponent.vue";
  import NavComponent from "@/components/NavComponent.vue";
  import OrderDetailComponent from "@/components/OrderDetailComponent.vue";
  import HeaderComponent from "@/components/HeaderComponent.vue";
  export default {
    name: "PresupuestadasView",
  
    components:{OrderTableComponent,NavComponent,OrderDetailComponent,HeaderComponent}
  };
  </script>
  