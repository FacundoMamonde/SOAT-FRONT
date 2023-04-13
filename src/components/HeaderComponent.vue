<template>
<div class="header container-fluid p-0">
  <b-navbar type="dark"  variant="dark" class="flex-column flex-md-row justify-content-md-between  ">
    <b-navbar-nav  >
      <b-navbar-brand href="#" class="ps-2 fs-2 ">SOAT</b-navbar-brand>
      </b-navbar-nav>
   <div class="d-flex align-self-md-center " >
  <b-input-group  >
    <b-form-input size="sm"></b-form-input>
      <template #append>
      <b-dropdown text="Buscar por" variant="primary">
        <b-dropdown-item>Cliente</b-dropdown-item>
        <b-dropdown-item>Equipo</b-dropdown-item>
      </b-dropdown>
    </template>
     </b-input-group>
  <b-button  variant="success rounded-pill" class="ms-2 fw-bold">+</b-button>
</div>
<div class=" mt-1 pr-0 ">
  <p class="h5 pr-1 text-light mb-0">Tecnico<b-avatar variant=danger></b-avatar></p>
  <router-link to="/" class="cerrarSesion mt-0">Cerrar Sesión</router-link> |
</div>
    </b-navbar>
</div>
</template>

<script>
export default {
  name: 'HeaderComponent',
  props: {
  }
}
</script>

<style scoped>
*, *::before, *::after {
    box-sizing: border-box;
}
.header
{min-width: 360px;}
.cerrarSesion{
  color:aliceblue;
  text-decoration: none;
}
</style>
