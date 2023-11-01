<template>
  <div class="header container-fluid p-0">
    <b-navbar type="dark" variant="dark" class="flex-column flex-md-row justify-content-md-between">
      <b-navbar-nav>
        <b-navbar-brand href="#" class="ps-2 fs-2">SOAT</b-navbar-brand>
      </b-navbar-nav>
      <div class="d-flex align-self-md-center">

        <b-input-group>
          <span class="input-group-text " id="basic-addon1"><b-icon-search></b-icon-search></span>
          <b-form-input v-model="filtro" @input="filtrarTabla" size="sm" placeholder="Buscar"></b-form-input>
          <template #append>
            <b-dropdown id="btnSearch" :text="filtroText" variant="primary">
              <b-dropdown-item @click="filtroPor = 'cliente', filtroText = 'Cliente'">Cliente</b-dropdown-item>
              <b-dropdown-item @click="filtroPor = 'equipo', filtroText = 'Equipo'">Equipo</b-dropdown-item>
            </b-dropdown>
          </template>
        </b-input-group>
        <NewOrderComponent></NewOrderComponent>
      </div>
      <div class="mt-1 pr-0">
        <div>
          <b-dropdown size="lg" variant="link" toggle-class="text-decoration-none" toggle-text="" no-caret>
            <template #button-content>
              <div>
                <p class="h5 pr-1 text-light mb-0">
                  <b-avatar variant="danger"></b-avatar> {{ username }}
                </p>
              </div>
            </template>
            <div>
              <b-dropdown-header id="dropdown-header-label" class="text-center">
                {{ username }}
              </b-dropdown-header>
              <b-dropdown-item href="/clientes">Clientes</b-dropdown-item>
              <b-dropdown-item v-if="getUserAdmin()" href="/admin/negocio">Config. Negocio</b-dropdown-item>
              <b-dropdown-item v-if="getUserAdmin()">Configuración</b-dropdown-item>
              <b-dropdown-item @click="logout()">Cerrar Sesión</b-dropdown-item>
            </div>
          </b-dropdown>
        </div>
        <!--
        <p class="h5 pr-1 text-light mb-0">
          {{username}}<b-avatar variant="danger"></b-avatar>
        </p>
        <a @click="logout()" class="cerrarSesion mt-0">Cerrar Sesión</a>
        |<a v-if="getUserAdmin()" class=" mt-0">Configuracion</a> 
        -->
      </div>
    </b-navbar>
  </div>
</template>

<script>
import { bus } from "../main";
import NewOrderComponent from "@/components/NewOrderComponent.vue";
export default {
  name: "HeaderComponent",
  components: {
    NewOrderComponent,
  },
  data() {
    return {
      filtro: "",
      filtroPor: "cliente",
      filtroText: "Cliente",
      username: ""
    };
  },
  created() {
    this.getUserName();
  },
  props: {},
  methods: {
    filtrarTabla() {
      bus.$emit("filtro-cambiado", {
        filtro: this.filtro,
        filtroPor: this.filtroPor
      });
    },
    logout() {
      localStorage.removeItem('token')

      this.$router.push('/');
    },
    getUserName() {
      this.username = localStorage.getItem('username')
    },
    getUserAdmin() {
      this.admin = localStorage.getItem('role');
      if (this.admin != 'admin') {
        return false
      }
      return true
    }
  },
};
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

.header {
  min-width: 360px;
}

.cerrarSesion {
  color: white;
  text-decoration: none;
  background-color: inherit;
  border: none;
  cursor: pointer;
}
</style>
