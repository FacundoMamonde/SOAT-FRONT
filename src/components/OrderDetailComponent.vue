<template>
  <div id="divOrderDetail" >
    <div class="row pt-2">
      <!-- DIV NUMERO Y FECHA DE ORDEN -->
      <div class="col-6 p-0">
        <p class="h2 ml-1 mb-0 pt-1">Orden #</p>
        <p class="badge bg-secondary">27/03/2023</p>
      </div>
      <div class="col-6">
        <!-- DIV DATOS CLIENTE -->
        <div class='row'>
          <div class="col-md-1" style="width: 50px;">
            <i class="bi bi-person-circle col-md-8" style="font-size: 40px;"></i> <!-- Icono de Cliente-->
          </div>
          <div class="col-md-8">
            <p class="m-0 pt-2">Nombre de cliente</p>
            <p class="mt-0">Celular del cliente</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6 p-0">
        <!-- DIV EQUIPO -->
        <div class='row'>
          <div class="col-md-1" style="width: 50px;">
            <i class="bi bi-laptop col-md-8" style="font-size: 40px;"></i> <!-- Icono de Equipo-->
          </div>
          <div class="col-md-8">
            <p class="m-0 pt-2">Tipo de Equipo - Marca</p>
            <p class="m-0">Modelo</p>
          </div>
        </div>
      </div>
      <div class="col-6">
        <!-- DIV ACCESORIOS -->
        <div class='row'>
          <div class="col-md-1" style="width: 50px;">
            <i class="bi bi-clipboard2-check col-md-8" style="font-size: 40px;"></i> <!-- Icono de Accesorios-->
          </div>
          <div class="col-md-8">
            <p class="m-0 pt-2">Cargador</p>
            <p class="m-0">PIN - Contraseña</p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h5 class="mt-3">Descripción de la falla</h5>
      <textarea class="col-11 p-0 m-0" name="" id="" cols="30" rows="10"></textarea>
    </div>
    <div>
      <h5 class="mt-3">Informe</h5>
      <textarea class="col-11 p-0 m-0" name="" id="" cols="30" rows="10"></textarea>
      <div>
        <p>Importe</p>
        <input type="text">
        <button class="btn btn-info">IMPRIMIR</button>
      </div>
    </div>
    <div>
      <button>Finalizar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetailComponent',
  props: {
  }
}
</script>

<style scoped></style>
