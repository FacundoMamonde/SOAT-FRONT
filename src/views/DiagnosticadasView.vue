<template>
    <div>
      <HeaderComponent></HeaderComponent>
      <NavComponent></NavComponent>
      <div id="divOrderContainer">
        <OrderTableComponent :estado="1" ></OrderTableComponent>
         <OrderDetailComponent :nextButton="'A presupuestada'"></OrderDetailComponent> 
      </div>
    </div>
  </template>
  
  <script>
  
  import OrderTableComponent from "@/components/OrderTableComponent.vue";
  import NavComponent from "@/components/NavComponent.vue";
  import OrderDetailComponent from "@/components/OrderDetailComponent.vue";
  import HeaderComponent from "@/components/HeaderComponent.vue";
  export default {
    name: "DiagnosticadasView",
  
    components:{OrderTableComponent,NavComponent,OrderDetailComponent,HeaderComponent}
  };
  </script>
  