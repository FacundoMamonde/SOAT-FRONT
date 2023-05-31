<template>
  <div class="nav d-flex justify-content-center w-100">
    <b-navbar class="p-0">
      <b-navbar-nav>
        <router-link
          to="/pendientes"
          class-active="active"
          class="p-2 nav-link col-md-mx-3 col-sm-4"
          >PENDIENTES</router-link
        >
        <router-link to="/terminadas" class="p-2 nav-link col-md-mx-3"
          >TERMINADAS</router-link
        >
        <router-link to="/entregadas" class="p-2 nav-link col-md-mx-3"
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
  color: rgba(0, 0, 0, 0.575);
}

.router-link-active,
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
