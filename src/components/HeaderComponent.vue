<template>
  <div class="header container-fluid p-0">
    <b-navbar
      type="dark"
      variant="dark"
      class="flex-column flex-md-row justify-content-md-between"
    >
      <b-navbar-nav>
        <b-navbar-brand
          router-link
          to="/ingresadas"
          class="ps-2 fs-2"
          v-b-tooltip.hover.right
          title="Volver a ordenes ingresadas"
          > <img src="./../logo.png" class="logo " /> SOAT </b-navbar-brand
        >
      </b-navbar-nav>
      <div v-if="buscadorOrdenes" class="d-flex align-self-md-center">
        <b-input-group>
          <span class="input-group-text" id="basic-addon1"
            ><b-icon-search></b-icon-search
          ></span>
          <b-form-input
            v-model="filtro"
            @input="filtrarTabla"
            size="sm"
            placeholder="Buscar"
          ></b-form-input>
          <template #append>
            <b-dropdown
              id="btnSearch"
              :text="filtroText"
              block
              variant="primary"
            >
              <b-dropdown-item
                @click="(filtroPor = 'cliente'), (filtroText = 'Cliente')"
                >Cliente</b-dropdown-item
              >
              <b-dropdown-item
                @click="(filtroPor = 'equipo'), (filtroText = 'Equipo')"
                >Equipo</b-dropdown-item
              >
            </b-dropdown>
          </template>
        </b-input-group>

        <NewOrderComponent></NewOrderComponent>
      </div>

      <div class="mt-1 pr-0 drop d-flex justify-content-end">
        <div class="w-100">
          <b-dropdown
            class="w-100 text-sm-center text-md-end"
            menu-class="w-100"
            size="lg"
            variant="link"
            block
            toggle-class="text-decoration-none"
            toggle-text=""
            no-caret
          >
            <template #button-content>
              <div class="w-100">
                <p
                  class="h5 pr-1 text-light mb-0"
                  v-b-tooltip.hover.left
                  :title="username"
                >
                  <b-avatar variant="danger"></b-avatar>
                </p>
              </div>
            </template>
            <div id="dropdown-usuario" class="w-100">
              <b-dropdown-header id="dropdown-header-label">
                <b-avatar class="m-auto" variant="danger"></b-avatar>
                <div>{{ username }}</div>
              </b-dropdown-header>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item router-link to="/clientes"
                >Clientes</b-dropdown-item
              >
              <b-dropdown-item v-b-modal.modal-config-usuario
                >Mis datos</b-dropdown-item
              >
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item disabled>Administración</b-dropdown-item>
              <b-dropdown-item
                v-if="getUserAdmin()"
                router-link
                to="/admin/negocio"
                >Negocio</b-dropdown-item
              >
              <b-dropdown-item
                v-if="getUserAdmin()"
                router-link
                to="/admin/usuarios"
                >Usuarios</b-dropdown-item
              >
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item @click="logout()">
                <b-icon-power></b-icon-power>Cerrar Sesión</b-dropdown-item
              >
            </div>
          </b-dropdown>
        </div>
      </div>
    </b-navbar>
    <div>
      <b-modal id="modal-config-usuario" title="Mis datos">
        <ConfigUsuarioComponent></ConfigUsuarioComponent>
        <template #modal-footer="{}">
          <div class="w-100"></div>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { bus } from "../main";
import NewOrderComponent from "@/components/NewOrderComponent.vue";
import ConfigUsuarioComponent from "@/components/user/ConfigUsuario.vue";
export default {
  name: "HeaderComponent",
  components: {
    NewOrderComponent,
    ConfigUsuarioComponent,
  },
  data() {
    return {
      filtro: "",
      filtroPor: "cliente",
      filtroText: "Cliente",
      username: "",
    };
  },
  created() {
    this.getUserName();
  },
  props: {
    buscadorOrdenes: Boolean,
  },
  methods: {
    filtrarTabla() {
      bus.$emit("filtro-cambiado", {
        filtro: this.filtro,
        filtroPor: this.filtroPor,
      });
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    },
    getUserName() {
      this.username = localStorage.getItem("name");
    },
    getUserAdmin() {
      this.admin = localStorage.getItem("role");
      if (this.admin != "admin") {
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

.drop {
  width: 200px !important;
}
input:focus {
  outline: none;
  box-shadow: none;
}

.logo{
  height: 35px;
  margin: auto;
}
</style>
