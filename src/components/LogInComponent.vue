<template>
  <div class="container-fluid d-flex p-0 min-vh-100 ancho">
    <div class="row flex-grow-1">
      <div
        class="col-md-6 d-none d-md-flex backgroundSoat text-white justify-content-center align-items-center"
      >
        <div class="text-center text-dark w-100">
          <h1 class="display-1">SOAT</h1>
        </div>
      </div>

      <div
        class="col-sm-12 col-md-6 bg-dark text-light d-flex justify-content-center align-items-center"
      >
        <div class="text-center w-100 p-4">
          <h1 class="d-md-none mb-3 display-1">SOAT</h1>
          <h2 class="mb-3">Bienvenido</h2>
          <p class="my-3">Por favor ingrese sus datos para iniciar sesión</p>
          <b-form class="w-50 m-auto">
            <b-form-input
              class="my-3 text-center"
              id="username"
              v-model="username"
              placeholder="Usuario"
              required
            ></b-form-input>
            <b-form-input
              class="my-3 text-center"
              id="password"
              v-model="password"
              placeholder="Contraseña"
              type="password"
              required
            ></b-form-input>
          </b-form>
          <div v-if="errorlogin">
            <span class="errorL"
              >Error al inciar sesion, revise los datos ingresados y vuelva a
              intentarlo</span
            >
          </div>
          <b-button variant="outline-light" @click="login()">INGRESAR</b-button>
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
    };
  },
  methods: {
    //onSubmit
    onSubmit() {},
    async login() {
      console.log(`Ejecutando login - usuario: ${this.username}`);
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

          // Redirige al usuario a la página de inicio o a otra página deseada
          this.$router.push("/ingresadas");
        } else {
          // La respuesta del servidor indica un error, maneja el error adecuadamente
          console.error("Error de inicio de sesión:", response.status);
          this.errorlogin = true;
        }
      } catch (error) {
        // Maneja errores de red u otros errores inesperados
        console.error("Error de inicio de sesión:", error);
      }
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
.backgroundSoat {
  background-color: #ededed;
}

.errorL {
  color: rgb(255, 70, 24);
}
</style>
