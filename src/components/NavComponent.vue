<template>
  <div class="w-100 d-flex justify-content-center navc">
    <b-navbar toggleable="lg" class="p-0">
      <b-navbar-toggle target="nav-links" class="m-auto"></b-navbar-toggle>
      <b-collapse id="nav-links" is-nav>
        <b-navbar-nav class="d-flex nav justify-content-around w-100">
          <router-link
            to="/ingresadas"
            class-active="active"
            class="p-2 nav-link"
          >
            INGRESADAS
          </router-link>

          <router-link to="/diagnosticadas" class="p-2 nav-link"
            >EN DIAGNOSTICO</router-link
          >

          <router-link to="/presupuestadas" class="p-2 nav-link"
            >PRESUPUESTADAS</router-link
          >

          <router-link to="/pendientes" class="p-2 nav-link"
            >PENDIENTES</router-link
          >

          <router-link to="/terminadas" class="p-2 nav-link"
            >TERMINADAS</router-link
          >

          <router-link to="/entregadas" class="p-2 nav-link col-md-mx-3"
            >ENTREGADAS</router-link
          >

          <router-link
            v-if="getUserAdmin()"
            to="/eliminadas"
            class="p-2 nav-link col-md-mx-3"
            >ELIMINADOS</router-link
          >
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "NavComponent",
  props: {},
  methods: {
    getUserAdmin() {
      this.admin = localStorage.getItem("role");
      if (this.admin !== "admin") {
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped>
.navc {
  background-color: #c5c5c5;
}
.nav-link {
  text-decoration: none;
  color: rgba(0, 0, 0, 0.575);
  border-top: 3px solid #c5c5c5;
}

.router-link-active {
  background-color: rgb(240, 240, 240);
  color: rgb(3, 3, 3) !important;
  border-top: 3px solid rgb(64, 97, 158);
}

.router-link-exact-active {
  color: rgb(50, 50, 50);
  cursor: pointer;
}
.nav {
  background-color: #c5c5c5;
  font-weight: bold;
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>
