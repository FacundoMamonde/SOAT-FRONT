<template>
  <div id="divOrderDetail" class="card" style="min-width: 360px; max-width: 1000px; border-radius: 0%!important;">
    <div id="orderDetailContainer" style="padding-left: 15px">
      <div class="row pt-2">
        <!-- DIV NUMERO Y FECHA DE ORDEN -->
        <div class="col-6 p-0">
          <p class="h2 ml-1 mb-0 pt-1">Orden # {{ data.id }}</p>
          <p class="badge bg-secondary"><i class="bi bi-calendar3"></i> 27/03/2023</p>
        </div>
        <div class="col-6">
          <!-- DIV DATOS CLIENTE -->
          <div class='d-flex flex-row'>
            <div class="col-md-1" style="width: 50px;">
              <i class="bi bi-person-circle col-md-8" style="font-size: 40px;"></i> <!-- Icono de Cliente-->
            </div>
            <div class="col-md-8">
              <p v-if="dataClient.name" class="m-0 pt-2">{{ dataClient.name }} </p>
              <p v-else class="m-0 pt-2"> Nombre de Cliente</p>

              <p v-if="dataClient.phone" class="mt-0">{{ dataClient.phone }}</p>
              <p v-else class="mt-0">Celular del cliente</p>

            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6 p-0">
          <!-- DIV EQUIPO -->
          <div class='d-flex flex-row'>
            <div class="col-md-1" style="width: 50px;">
              <i class="bi bi-laptop col-md-8" style="font-size: 40px;"></i> <!-- Icono de Equipo-->
            </div>
            <div class="col-md-8">
              <p v-if="data.equipoTipo" class="m-0 pt-2"> {{ data.equipoTipo }} - {{ data.equipoMarca }}</p>
              <p v-else class="m-0 pt-2">Tipo de Equipo - Marca</p>

              <p v-if="data.equipoModelo" class="m-0">{{ data.equipoModelo }}</p>
              <p v-else class="m-0">Modelo</p>
            </div>
          </div>
        </div>
        <div class="col-6">
          <!-- DIV ACCESORIOS -->
          <div class='d-flex flex-row'>
            <div class="col-md-1" style="width: 50px; ">
              <i class="bi bi-clipboard2-check col-md-8" style="font-size: 40px;"></i> <!-- Icono de Accesorios-->
            </div>
            <div class="col-md-8">
              <p v-if="data.accesorio" class="m-0 pt-2 "> {{ data.accesorio }}</p>
              <p v-else class="m-0 pt-2 ">Sin Accesorios</p>
              <p v-if="data.pass" class="m-0"> Pass: {{ data.equipoPass }}</p>
              <p v-else class="m-0">Sin contraseña</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h5 class="mt-3">Descripción de la falla</h5>
        <textarea v-model="data.falla" class="col-11 p-0 m-0"
          style="height: 100px; min-height:80px; max-height: 120px; width: 95%" name="" id="" cols="30"
          rows="10"> </textarea>
      </div>
      <div>
        <h5 class="mt-3">Informe</h5>
        <textarea v-model="data.informe" class="col-11 p-0 m-0"
          style="height: 100px; min-height:80px; max-height: 120px; width: 95%" name="" id="" cols="30"
          rows="10"></textarea>
        <div class="d-flex flex-row" style="width: 97%">
          <div class="p-2 w-100">
            <span class="align-middle">$ </span>
            <input v-model="data.importe" type="text" style="width:100px">
          </div>
          <div class="p-2 flex-shrink-1">
            <button v-on:click="loadAPI(8)" class="btn btn-primary btn-sm m-0" style="width:100px"> <i
                class="bi bi-printer"></i>
              Imprimir</button>
          </div>
        </div>
      </div>
    </div>
    <div class="w-100 d-flex justify-content-end card-footer">
      <button class="btn btn-success">Finalizar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetailComponent',
  data() {
    return {
      data: [],
      id: null,
      dataClient: []
    };
  },
  methods: {
    async loadAPI(idOrder) {
      fetch("https://635088ad3e9fa1244e483b3c.mockapi.io/OrderList/" + idOrder)
        .then(response => response.json())
        .then(data => this.data = data,
        this.loadAPIClient())
        
    },
    async loadAPIClient() {
      fetch("https://635088ad3e9fa1244e483b3c.mockapi.io/clients/" + this.data.clientID)
        .then(response => response.json())
        .then(data => this.dataClient = data)
        console.log(this.dataClient)
    },
  }
}



</script>

<style scoped></style>


