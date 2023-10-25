<template>
  <div class="nav d-flex justify-content-center w-100">
    <b-navbar class="p-0">
       <b-navbar-nav>
        
        <router-link to="/ingresadas" class-active="active" class="p-2 nav-link"> INGRESADAS </router-link>
          
        <router-link to="/diagnosticadas" class="p-2 nav-link">EN DIAGNOSTICO</router-link>

        <router-link to="/presupuestadas" class="p-2 nav-link">PRESUPUESTADAS</router-link>

        <router-link to="/pendientes" class="p-2 nav-link">PENDIENTES</router-link>

        <router-link to="/terminadas" class="p-2 nav-link">TERMINADAS</router-link>

        <router-link to="/entregadas" class="p-2 nav-link col-md-mx-3">ENTREGADAS</router-link>

      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "NavComponent",
  props: {},
};
</script>

<style scoped>
.nav-link {
  text-decoration: none;
  color: rgba(0, 0, 0, 0.575);
  border-top: 3px solid #c5c5c5 ;
}

.router-link-active{
  background-color: rgb(240, 240, 240);
  color: rgb(3, 3, 3) !important;
  border-top: 3px solid rgb(64, 97, 158) ;
}

.router-link-exact-active {
  color: rgb(50, 50, 50);
  cursor: pointer;
}
.nav {
  background-color: #c5c5c5;
  min-width: 360px;
  font-weight: bold;
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>
