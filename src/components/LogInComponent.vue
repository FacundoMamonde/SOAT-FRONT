<template>
  <div class="container-fluid d-flex p-0 min-vh-100 ancho">
    <div class="row flex-grow-1">
      <div class="col-md-6 d-none d-md-flex backgroundSoat text-white justify-content-center align-items-center">
        <div class="text-center text-dark w-100">
          <img src="./../logo.png" class="logo" />
          <h1 class="display-1">SOAT</h1>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 bg-dark text-light d-flex justify-content-center align-items-center">
        <div v-if="this.isBusy" class="text-center w-100 p-4"> 
          <b-spinner class="m-auto my-3" medium variant="primary"></b-spinner>

          <h3> Iniciando Sesión </h3>
        </div>
        <div v-else class="text-center w-100 p-4">
          <h1 class="d-md-none mb-3 display-1">SOAT</h1>
          <h2 class="mb-3">Bienvenido</h2>
          <p class="my-3">Por favor ingrese sus datos para iniciar sesión</p>
          <b-form class="w-50 m-auto">
            <b-form-input class="my-3 text-center" id="username" v-model="username" placeholder="Usuario"
              required></b-form-input>
            <b-form-input class="my-3 text-center" id="password" v-model="password" placeholder="Contraseña"
              type="password" required></b-form-input>
            <p class="my-3">Usuario: tecnico1 - Pass: tecnico123</p>
          </b-form>
          <b-button variant="outline-light" @click="login()">INGRESAR</b-button>
          <div v-if="errorlogin" class="divErrorLogin">
            <div class="alert alert-danger errorL" role="alert">Error al inciar sesión, revise los datos ingresados y vuelva a
              intentarlo</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { backendData } from "../main";
export default {
  name: "LogInComponent",
  props: {},
  data() {
    return {
      username: "",
      password: "",
      errorlogin: false,
      isBusy: false,
    };
  },
  methods: {
    //onSubmit
    toggleBusy() {
      this.isBusy = !this.isBusy
    },
    onSubmit() { },
    async login() {
      this.toggleBusy();
      try {
        const response = await fetch(`${backendData}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        if (response.ok) {

          this.errorlogin = false;
          // La solicitud fue exitosa, parsea la respuesta JSON
          const data = await response.json();

          // El backend responderá con un token JWT si las credenciales son válidas
          // Almacena el token en el almacenamiento local o en una cookie para su posterior uso
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("username", data.username);
          localStorage.setItem("name", data.name);
          localStorage.setItem("role", data.role);
          this.toggleBusy();
          // Redirige al usuario a la página de inicio o a otra página deseada
          this.$router.push("/ingresadas");
        } else {
          // La respuesta del servidor indica un error, maneja el error adecuadamente
          this.toggleBusy();
          console.error("Error de inicio de sesión:", response.status);
          this.errorlogin = true;
        }
      } catch (error) {
        this.toggleBusy();
        // Maneja errores de red u otros errores inesperados
        console.error("Error de inicio de sesión:", error);
      }
    },
  },
};
</script>

<style scoped>
.logo {
  height: 200px;
  filter: brightness(0.10);
  margin-bottom: 20px;
}

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

.backgroundSoat {
  background-color: #ededed;
}

.errorL {
  width: 23vw;
  margin: auto;
}

.divErrorLogin{
  padding-top: 20px;
}
</style>
