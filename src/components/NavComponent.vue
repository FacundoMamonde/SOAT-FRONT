<template>
  <div class="nav d-flex justify-content-center  w-100">
    <b-navbar class="p-0">
      <b-navbar-nav>
        <router-link
          to="/pendientes"
          class-active="active"
          class="p-2 nav-link col-md-mx-3 col-sm-4"
          >PENDIENTES</router-link
        >
        <router-link to="/terminadas" class="p-2 nav-link col-md-mx-3 "
          >TERMINADAS</router-link
        >
        <router-link to="/entregadas" class="p-2 nav-link col-md-mx-3  "
          >ENTREGADAS</router-link
        >
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
  color: black;
}

.router-link-active,
.router-link-exact-active {
  background-color: #b5b5b5;
  cursor: pointer;
}
.nav {
  background-color: #acacac;
  min-width: 360px;
}
*, *::before, *::after {
    box-sizing: border-box;
}

</style>
