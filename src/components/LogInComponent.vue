<template>
  <div class="container d-flex ancho">
    <div class="soat col-sm-12 col-md-6 d-flex">
      <div class="m-auto">
        <h1 class="mb-0 titulo">SOAT</h1>
        <p class="mt-0 text-center">3000</p>
      </div>
    </div>
    <div class="col-sm-12 col-md-6 logIn d-flex">
      <div class="m-auto text-center text-light">
        <h1 class="mb-3">Bienvenido</h1>
        <p class="my-3">Por favor ingrese sus datos para iniciar sesion</p>
        <b-form @submit.prevent="onSubmit">
          <b-form-input
            class="my-3 rounded-pill text-center"
            id="username"
            v-model="username"
            placeholder="Usuario/correo"
            required
          ></b-form-input>
          <b-form-input
            class="my-3 rounded-pill text-center"
            id="password"
            v-model="password"
            placeholder="Contraseña"
            type="password"
            required
          ></b-form-input>
          <router-link
            to="/pendientes"
            class="routerLink btnSubmit rounded-pill p-2"
            >Iniciar sesion</router-link
          >
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LogInComponent",
  props: {},
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    onSubmit() {
      // Add your login logic here
    },
  },
};
</script>

<style scoped>
.soat {
  color: #233753 !important;
  border: 1px solid #233753;
  height: 100vh;
}
.logIn {
  background-color: #233753;
}
.titulo {
  font-size: 7rem;
}
.btnSubmit {
  background-color: #4f5f75;
  border: none;
}
.routerLink {
  text-decoration: none;
  color: aliceblue;
}
.ancho {
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;

  z-index: 100;
  width: 100vw;
}
</style>
