<template>
  <div id="divConfigUsuarios" class="h-100">
    <div class="mx-auto w-75 d-flex flex-column flex-grow-1">
      <div class="d-flex justify-content-end mt-3">
        <b-button
          variant="success"
          @click="newUserReset(), newUserDataReset()"
          v-b-modal.modal-newUser
        >
          Nuevo Usuario
        </b-button>
      </div>
      <h5>Listado de usuarios</h5>
      <div class="tabla border-top border-1  flex-grow-1">
        <b-table class="flex-grow-1 "
          striped
          :items="usuarios"
          :fields="fields"
          label-sort-asc=""
          label-sort-desc=""
          label-sort-clear=""
        >
          <template #head()="data">
            <span class="text">{{ data.label }}</span>
          </template>
          <template #cell()="data">
            <td>
              <span class="text-secondary">{{ data.value }}</span>
            </td>
          </template>
          <template v-slot:cell(actions)="data" >
            <div class="d-flex justify-content-end me-3">
            <!-- Boton editar-->
            <span class="p-0 m-0">
              <a @click="selectUser(data.item), newDataReset()">
                <b-button
                  v-b-modal.modal-editUser
                  size="sm"
                  variant="outline-primary"
                >
                  <b-icon icon="pencil-square" scale="1" />
                </b-button>
              </a>
            </span>
            <!-- Boton reset password-->
            <span class="p-0 m-0  ms-3 ">
              <a @click="selectUser(data.item), newPasswordReset()">
                <b-button
                  v-b-modal.modal-resetPassword
                  size="sm"
                  variant="outline-secondary"
                >
                  <b-icon icon="lock-fill" scale="1" />
                </b-button>
              </a>
            </span>
            <!-- Boton delete user-->
            <span class="p-0 m-0  ms-3">
              <a @click="selectUser(data.item), deleteUserReset()">
                <b-button
                  v-b-modal.modal-deleteUser
                  size="sm"
                  variant="outline-danger"
                >
                  <b-icon icon="trash" scale="1" />
                </b-button>
              </a>
            </span>
          </div>
          </template>
        </b-table>
        <!-- 
            <b-button variant="success" @click="newUserReset(), newUserDataReset()" v-b-modal.modal-newUser>Nuevo
                Usuario</b-button> -->
      </div>

      <!-- MODAL NUEVO USUARIO-->
      <b-modal id="modal-newUser" title="Nuevo usuario">
        <div v-if="!newUser.success">
          <h6>Username</h6>
          <i>(al menos 5 caracteres)</i>
          <b-form-input v-model="newUserData.username"> </b-form-input>
          <h6>Nombre</h6>
          <i>(al menos 5 caracteres)</i>
          <b-form-input v-model="newUserData.name"></b-form-input>

          <h6 class="mt-5">Contraseña</h6>
          <i>(al menos 6 caracteres)</i>
          <b-form-input type="password" v-model="newUserData.password">
          </b-form-input>
          <h6 class="mt-2">Ingrese nuevamente la nueva contraseña</h6>
          <b-form-input type="password" v-model="newUserData.password2">
          </b-form-input>
        </div>

        <!-- Mensajes -->
        <b-alert
          class="mt-3"
          show
          variant="primary"
          v-if="isBusyNewUser == true"
        >
          <b-spinner class="ms-1 me-1" small variant="primary"></b-spinner>
          Procesando solicitud...
        </b-alert>

        <b-alert
          class="mt-3"
          show
          variant="success"
          v-if="newUser.success == true"
        >
          <b-icon class="ms-1 me-1" icon="check-circle-fill" scale="1"></b-icon>
          Se agrego el usuario {{ newUserData.username }} con éxito
        </b-alert>

        <b-alert class="mt-3" show variant="danger" v-if="newUser.error != ''">
          <b-icon class="ms-1 me-1" icon="x-circle-fill" scale="1"></b-icon>
          {{ newUser.error }}
        </b-alert>

        <!-- Modal footer -->
        <template #modal-footer="{}">
          <div>
            <div v-if="!newUser.success">
              <b-button
                v-if="
                  newUserData.password.length > 5 &&
                  newUserData.password == newUserData.password2 &&
                  newUserData.username.length > 4 &&
                  newUserData.name.length > 4
                "
                variant="primary"
                @click="newUserPost()"
                >Crear Usuario</b-button
              >
              <b-button v-else variant="primary" disabled
                >Crear Usuario</b-button
              >
            </div>
          </div>
        </template>
      </b-modal>

      <!-- MODAL EDITAR-->
      <b-modal id="modal-editUser" title="Modificar usuario">
        <div v-if="!newData.success">
          <h6>Username</h6>
          <b-form-input class="mb-3" v-model="selectedUser.username">
          </b-form-input>
          <h6>Nombre</h6>
          <b-form-input
            class="mb-3"
            label="Nombre"
            v-model="selectedUser.name"
          ></b-form-input>
          <h6>Rol</h6>
          <b-form-select
            class="mb-3"
            v-model="selectedUser.role"
            :options="usersRoles"
          >
          </b-form-select>
        </div>
        <b-alert
          class="mt-3"
          show
          variant="primary"
          v-if="isBusyUpdateUser == true"
        >
          <b-spinner class="ms-1 me-1" small variant="primary"></b-spinner>
          Procesando solicitud...
        </b-alert>

        <b-alert
          class="mt-3"
          show
          variant="success"
          v-if="newData.success == true"
        >
          <b-icon class="ms-1 me-1" icon="check-circle-fill" scale="1"></b-icon>
          Se modificó {{ selectedUser.username }} correctamente
        </b-alert>

        <b-alert class="mt-3" show variant="danger" v-if="newData.error != ''">
          <b-icon class="ms-1 me-1" icon="x-circle-fill" scale="1"></b-icon>
          {{ newData.error }}
        </b-alert>

        <!-- Modal footer -->
        <template #modal-footer="{}">
          <div>
            <div v-if="!newData.success">
              <b-button
                v-if="
                  selectedUser.name != actualUserData.name ||
                  selectedUser.username != actualUserData.username ||
                  selectedUser.role != actualUserData.role
                "
                v-b-modal.modal-confirmChanges
                variant="primary"
                >Guardar</b-button
              >
              <b-button
                v-else
                v-b-modal.modal-confirmChanges
                variant="primary"
                disabled
                >Guardar</b-button
              >
            </div>
          </div>
        </template>
      </b-modal>

      <!-- MODAL CONFIRMACION DE CAMBIOS -->
      <template>
        <b-modal id="modal-confirmChanges" title="Confirmar cambios">
          <h5 class="mb-3">Desea afectuar los siguientes cambios?</h5>
          <div
            v-if="this.selectedUser.username != this.actualUserData.username"
          >
            <b-alert class="mt-3" show variant="warning">
              <h6>Username:</h6>
              <h6>
                {{ this.actualUserData.username }}
                <b-icon icon="arrow-right"></b-icon>
                {{ this.selectedUser.username }}
              </h6>
            </b-alert>
          </div>
          <div v-if="this.selectedUser.name != this.actualUserData.name">
            <b-alert class="mt-3" show variant="warning">
              <h6>Nombre:</h6>
              <h6>
                {{ this.actualUserData.name }}
                <b-icon icon="arrow-right"></b-icon>
                {{ this.selectedUser.name }}
              </h6>
            </b-alert>
          </div>
          <div v-if="this.selectedUser.role != this.actualUserData.role">
            <b-alert class="mt-3" show variant="warning">
              <h6>Rol:</h6>
              <h6>
                {{ this.actualUserData.role }}
                <b-icon icon="arrow-right"></b-icon>
                {{ this.selectedUser.role }}
              </h6>
            </b-alert>
          </div>

          <!-- Modal footer -->
          <template #modal-footer="{ ok }">
            <div class="w-100">
              <b-button class="me-2" @click="ok"> Cancelar </b-button>
              <b-button
                variant="primary"
                class="float-center"
                @click="updateUser(), ok()"
              >
                Confirmar
              </b-button>
            </div>
          </template>
        </b-modal>
      </template>

      <!-- MODAL RESET PASSWORD -->
      <b-modal
        id="modal-resetPassword"
        title="Resetear contraseña"
        newPassword.success="false"
      >
        <div v-if="!newPassword.success">
          <h6>Ingrese la nueva contraseña</h6>
          <b-form-input
            id="inputNewPassword1"
            type="password"
            v-model="newPassword.newPassword"
          >
          </b-form-input>
          <h6>Ingrese nuevamente la nueva contraseña</h6>
          <b-form-input
            id="inputNewPassword2"
            type="password"
            v-model="newPassword.newPassword2"
          >
          </b-form-input>
        </div>
        <!-- ALERTAS -->
        <b-alert
          class="mt-3"
          show
          variant="primary"
          v-if="isBusyNewPassword == true"
        >
          <b-spinner class="ms-1 me-1" small variant="primary"></b-spinner>
          Procesando solicitud...
        </b-alert>

        <b-alert
          class="mt-3"
          show
          variant="success"
          v-if="newPassword.success == true"
        >
          <b-icon class="ms-1 me-1" icon="check-circle-fill" scale="1"></b-icon>
          Se actualizó la contraseña de
          {{ selectedUser.username }} correctamente
        </b-alert>

        <b-alert
          class="mt-3"
          show
          variant="danger"
          v-if="newPassword.error != ''"
        >
          <b-icon class="ms-1 me-1" icon="x-circle-fill" scale="1"></b-icon>
          {{ newPassword.error }}
        </b-alert>

        <!-- Modal footer -->
        <template #modal-footer="{}">
          <div class="w-100">
            <div v-if="!newPassword.success">
              <div
                v-if="
                  (newPassword.newPassword.length > 5) &
                  (newPassword.newPassword == newPassword.newPassword2)
                "
              >
                <b-button
                  variant="primary"
                  size="sm"
                  class="float-center"
                  @click="alertsErrorReset(), newPass()"
                >
                  Cambiar
                </b-button>
              </div>
            </div>
          </div>
        </template>
      </b-modal>

      <!-- MODAL ELIMINAR USUARIO -->

      <b-modal
        id="modal-deleteUser"
        title="Eliminar Usuario"
        deleteUser.success="false"
      >
        <h6 v-if="!deleteUser.success">
          Esta seguro que desea eliminar el usuario
          {{ selectedUser.username }} ?
        </h6>

        <!-- ALERTAS -->
        <b-alert
          class="mt-3"
          show
          variant="primary"
          v-if="isBusyDeleteUser == true"
        >
          <b-spinner class="ms-1 me-1" small variant="primary"></b-spinner>
          Procesando solicitud...
        </b-alert>

        <b-alert
          class="mt-3"
          show
          variant="success"
          v-if="deleteUser.success == true"
        >
          <b-icon class="ms-1 me-1" icon="check-circle-fill" scale="1"></b-icon>
          Se eliminó el usuario {{ selectedUser.username }} correctamente
        </b-alert>

        <b-alert
          class="mt-3"
          show
          variant="danger"
          v-if="deleteUser.error != ''"
        >
          <b-icon class="ms-1 me-1" icon="x-circle-fill" scale="1"></b-icon>
          {{ deleteUser.error }}
        </b-alert>

        <!-- Modal footer -->
        <template #modal-footer="{}">
          <div class="w-100">
            <div v-if="!deleteUser.success">
              <b-button class="me-2" @click="ok"> Cancelar </b-button>
              <b-button
                variant="primary"
                class="float-center"
                @click="delUser(), ok()"
              >
                Eliminar
              </b-button>
            </div>
          </div>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { backendData } from "../../main";

export default {
  name: "ConfigUsuariosComponent",
  props: {},
  data() {
    return {
      isBusy: false,
      isBusyUpdateUser: false,
      isBusyNewPassword: false,
      isBusyNewUser: false,
      isBusyDeleteUser: false,
      usuarios: Array,
      fields: [
        { key: "username", label: "Username", sortable: true },
        { key: "name", label: "Nombre", sortable: true },
        { key: "role", label: "Rol", sortable: true },
        { key: "actions", label: "" },
      ],
      usersRoles: ["user", "admin"],
      selectedUser: {},
      actualUserData: {},
      newPassword: {
        newPassword: "",
        newPassword2: "",
        error: "",
        success: false,
      },
      newData: { error: "", success: false },
      newUserData: { username: null, name: null, password: "", password2: "" },
      newUser: { error: "", success: false },
      deleteUser: { error: "", success: false },
    };
  },
  computed: {},
  created() {
    this.loadData();
  },
  methods: {
    /// --- METODO CARGA DE USUARIOS --- ///
    async loadData() {
      this.toggleBusy();
      try {
        await fetch(`${backendData}/auth/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        })
          .then((response) => response.json())
          .then((json) => (this.usuarios = json));
    this.toggleBusy();
      } catch (error) {
        this.toggleBusy();
        console.error("Error al obtener Usuario:", error);
      }
    },

    ///---- METODO NEW USER ----///
    async newUserPost() {
      this.newUserReset();
      this.toggleBusy("newUser");
      // DEMORA ////////////////////
      await this.sleepFunction(1500);
      //////////////////////////////
      try {
        const response = await fetch(`${backendData}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
          body: JSON.stringify(this.newUserData),
        });
        //// ACTUAL
        if (!response.ok) {
          // En caso de error
          const errorResponse = await response.json();
          this.newUser.error = errorResponse.message;
        } else {
          // En caso de Exito
          this.newUser.success = true;
        }
        this.toggleBusy("newUser");
      } catch (error) {
        // En caso de no conectarse al servidor
        this.toggleBusy("newUser");
        this.newUser.error = "Error al conectarse con el servidor";
      }
      this.loadData();
    },

    ///---- METODO UPDATE USER ----///
    async updateUser() {
      this.newDataReset();
      this.toggleBusy("updateUser");
      // DEMORA ////////////////////
      await this.sleepFunction(1500);
      //////////////////////////////
      try {
        const response = await fetch(`${backendData}/auth/user`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
          body: JSON.stringify(this.selectedUser),
        });
        //// ACTUAL
        if (!response.ok) {
          // En caso de error
          const errorResponse = await response.json();
          this.newData.error = errorResponse.error;
        } else {
          // En caso de Exito
          this.newData.success = true;
        }
        this.toggleBusy("updateUser");
      } catch (error) {
        // En caso de no conectarse al servidor
        this.toggleBusy("updateUser");
        this.newData.error = "Error al conectarse con el servidor";
      }
      this.loadData();
    },
    ///---- METODO DELETE USER ----///
    async delUser() {
      this.deleteUserReset();
      this.toggleBusy("deleteUser");
      // DEMORA ////////////////////
      await this.sleepFunction(1500);
      //////////////////////////////
      try {
        const response = await fetch(
          `${backendData}/auth/user/${this.selectedUser.username}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.token}`,
            },
          }
        );
        //// ACTUAL
        if (!response.ok) {
          // En caso de error
          const errorResponse = await response.json();
          this.deleteUser.error = errorResponse.message;
        } else {
          // En caso de Exito
          this.deleteUser.success = true;
        }
        this.toggleBusy("deleteUser");
      } catch (error) {
        // En caso de no conectarse al servidor
        this.toggleBusy("deleteUser");
        this.deleteUser.error = "Error al conectarse con el servidor";
      }
      this.loadData();
    },

    ///---- METODO RESET PASSWORD----///
    async newPass() {
      this.toggleBusy("newPassword");
      // DEMORA ////////////////////
      await this.sleepFunction(1500);
      //////////////////////////////
      try {
        const response = await fetch(`${backendData}/auth/resetpassword`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
          body: JSON.stringify({
            username: this.selectedUser.username,
            newPassword: this.newPassword.newPassword,
          }),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          this.newPassword.error = errorResponse.message;
        } else {
          // Manejo de éxito
          this.newPassword.success = true;
        }
        this.toggleBusy("newPassword");
      } catch (error) {
        // Manejo de errores generales que no sean errores de respuesta HTTP
        this.toggleBusy("newPassword");
        this.newPassword.error = "Error al conectarse con el servidor";
      }
    },
    async sleepFunction(ms) {
      await new Promise((r) => setTimeout(r, ms));
    },
    toggleBusy(option) {
      if (option == null) {
        this.isBusy = !this.isBusy;
      }
      //this.toggleBusy('updateUser')
      if (option == "updateUser") {
        this.isBusyUpdateUser = !this.isBusyUpdateUser;
      }
      //toggleBusy('newPassword')
      if (option == "newPassword") {
        this.isBusyNewPassword = !this.isBusyNewPassword;
      }
      if (option == "newUser") {
        this.isBusyNewUser = !this.isBusyNewUser;
      }
      if (option == "deleteUser") {
        this.isBusyDeleteUser = !this.isBusyDeleteUser;
      }
    },
    selectUser(user) {
      this.selectedUser = { ...user };
      this.actualUserData = { ...this.selectedUser };
    },
    newPasswordReset() {
      this.newPassword = {
        newPassword: "",
        newPassword2: "",
        error: "",
        success: false,
      };
    },
    newDataReset() {
      this.newData.success = false;
      this.newData.error = "";
    },
    deleteUserReset() {
      this.deleteUser.success = false;
      this.deleteUser.error = "";
    },
    alertsErrorReset() {
      (this.newPassword.error = ""), (this.newPassword.success = false);
    },
    newUserReset() {
      this.newUser = { error: "", success: false };
    },
    newUserDataReset() {
      this.newUserData = {
        username: null,
        name: null,
        password: "",
        password2: "",
      };
    },
  },
};
</script>

<style scoped>
#divConfigUsuarios {
  background-color: #ededed;
}

input:focus {
  border-color: none;
  box-shadow: none;
}

.textError {
  color: red;
}
.tabla {
 
  white-space: nowrap;
}

.tabla::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.tabla::-webkit-scrollbar-thumb {
  background-color: #6c757d;
  border-radius: 5px;
}

.tabla::-webkit-scrollbar-track {
  background-color: transparent;
}

.tabla {
  overflow-x: scroll !important;
   white-space: nowrap;
  scrollbar-width: thin;
  scrollbar-color: #6c757d transparent;
}

.text {
  color: #161616;
}

.text-secondary {
  color: rgb(36, 36, 36);
}

.tabla::-webkit-scrollbar-thumb {
  background-color: #505050;
  border-radius: 5px;
}

.tabla::-webkit-scrollbar-track {
  background-color: transparent;
}

.tabla {
  overflow-x: scroll !important;
  white-space: nowrap;
  scrollbar-width: thin;
  scrollbar-color: #6c757d transparent;
}
</style>
