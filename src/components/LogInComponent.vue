<template>
  <div class="container-fluid d-flex  p-0 min-vh-100 ancho">
    <div class="row flex-grow-1">
      <div class="col-md-6 d-none d-md-flex bg-light text-white justify-content-center align-items-center">
        <div class="text-center text-dark w-100">
          <h1 class="display-1">SOAT</h1>
         
        </div>
      </div>
  
      <div class="col-sm-12 col-md-6 bg-dark text-light d-flex justify-content-center align-items-center">
        <div class="text-center w-100 p-4">
          <h1 class="d-md-none mb-3 display-1">SOAT</h1>
          <h2 class="mb-3">Bienvenido</h2>
          <p class="my-3">Por favor ingrese sus datos para iniciar sesión</p>
          <b-form @submit.prevent="onSubmit" class=" w-50 m-auto  ">
            <b-form-input
              class="my-3 rounded-pill text-center    "
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
              >Iniciar sesión</router-link
            >
          </b-form>
        </div>
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
     
    },
  },
};
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
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
