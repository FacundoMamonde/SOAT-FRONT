<template>
    <div id="divConfigUsuarios">
        <h1>Usuarios</h1>
        <div>
            <b-table striped hover :items="usuarios" :fields="fields" label-sort-asc="" label-sort-desc=""
                label-sort-clear="">
                <template v-slot:cell(actions)="data">
                    <!-- Boton editar-->
                    <span class="p-0 m-0">
                        <a @click="selectUser(data.item), newDataReset()">
                            <b-button v-b-modal.modal-editUser size="sm" variant="outline-primary">
                                <b-icon icon="pencil-square" scale="1" />
                            </b-button>
                        </a>
                    </span>

                    <span class="p-0 m-0">
                        <a @click="selectUser(data.item), newPasswordReset()">
                            <b-button v-b-modal.modal-resetPassword size="sm" variant="outline-primary">
                                <b-icon icon="lock-fill" scale="1" />
                            </b-button>
                        </a>
                    </span>
                </template>
            </b-table>

            <b-button variant="success" @click="newUserReset()" v-b-modal.modal-newUser>Nuevo Usuario</b-button>
        </div>

        <!-- MODAL NUEVO USUARIO-->
        <b-modal id="modal-newUser" title="Nuevo usuario">
            <h6>Username</h6>
            <b-form-input v-model=newUserData.username> </b-form-input>
            <h6>Nombre</h6>
            <b-form-input v-model=newUserData.name></b-form-input>
            <h6 class="mt-5">Contraseña <i>(al menos 6 caracteres)</i></h6>
            
            <b-form-input type="password" v-model=newUserData.password> </b-form-input>
            <h6 class="mt-2">Ingrese nuevamente la nueva contraseña</h6>
            <b-form-input type="password" v-model=newUserData.password2> </b-form-input>


            <!-- Mensajes -->
            <b-alert class="mt-3" show variant="primary" v-if="isBusyNewUser == true">
                <b-spinner class="ms-1 me-1" small variant="primary"></b-spinner> Procesando solicitud...
            </b-alert>

            <b-alert class="mt-3" show variant="success" v-if="newUser.success == true">
                <b-icon class="ms-1 me-1" icon="check-circle-fill" scale="1"></b-icon> Se agrego el usuario con éxito
            </b-alert>

            <b-alert class="mt-3" show variant="danger" v-if="newUser.error != ''">
                <b-icon class="ms-1 me-1" icon="x-circle-fill" scale="1"></b-icon>
                {{ newUser.error }}
            </b-alert>

            <!-- Modal footer -->
            <template #modal-footer="{ }">
                <b-button v-if="newUserData.username != null
                    && newUserData.name != null 
                    && (newUserData.password).length > 5 
                    && newUserData.password == newUserData.password2" variant="primary" @click="newUserPost()">Crear Usuario</b-button>
                <b-button v-else variant="primary" disabled>Crear Usuario</b-button>
            </template>
        </b-modal>


        <!-- MODAL EDITAR-->
        <b-modal id="modal-editUser" title="Modificar usuario">
            <h6>Username</h6>
            <b-form-input id="inputEmail" v-model=selectedUser.username> </b-form-input>
            <h6>Nombre</h6>
            <b-form-input id="inputNombre" label="Nombre" v-model=selectedUser.name></b-form-input>
            <h6>Rol</h6>
            <b-form-select id="table-style-variant" v-model="selectedUser.role" :options="usersRoles">
            </b-form-select>

            <b-alert class="mt-3" show variant="primary" v-if="isBusyUpdateUser == true">
                <b-spinner class="ms-1 me-1" small variant="primary"></b-spinner> Procesando solicitud...
            </b-alert>

            <b-alert class="mt-3" show variant="success" v-if="newData.success == true">
                <b-icon class="ms-1 me-1" icon="check-circle-fill" scale="1"></b-icon> Se actualizó la información
                correctamente
            </b-alert>

            <b-alert class="mt-3" show variant="danger" v-if="newData.error != ''">
                <b-icon class="ms-1 me-1" icon="x-circle-fill" scale="1"></b-icon>
                {{ newData.error }}
            </b-alert>

            <!-- Modal footer -->
            <template #modal-footer="{ }">
                <b-button v-if="selectedUser.name != actualUserData.name
                    || selectedUser.username != actualUserData.username
                    || selectedUser.role != actualUserData.role" v-b-modal.modal-confirmChanges
                    variant="primary">Guardar</b-button>
                <b-button v-else v-b-modal.modal-confirmChanges variant="primary" disabled>Guardar</b-button>
            </template>
        </b-modal>

        <!-- MODAL CONFIRMACION DE CAMBIOS -->
        <template>
            <b-modal id="modal-confirmChanges" title="Confirmar cambios">
                <h5 class="mb-3">Desea afectuar los siguientes cambios?</h5>
                <div v-if="this.selectedUser.username != this.actualUserData.username">
                    <b-alert class="mt-3" show variant="warning">
                        <h6>Username: </h6>
                        <h6>{{ this.actualUserData.username }} <b-icon icon="arrow-right"></b-icon> {{
                            this.selectedUser.username }}</h6>
                    </b-alert>
                </div>
                <div v-if="this.selectedUser.name != this.actualUserData.name">
                    <b-alert class="mt-3" show variant="warning">
                        <h6>Nombre: </h6>
                        <h6>{{ this.actualUserData.name }} <b-icon icon="arrow-right"></b-icon> {{ this.selectedUser.name }}
                        </h6>
                    </b-alert>
                </div>
                <div v-if="this.selectedUser.role != this.actualUserData.role">
                    <b-alert class="mt-3" show variant="warning">
                        <h6>Rol: </h6>
                        <h6>{{ this.actualUserData.role }} <b-icon icon="arrow-right"></b-icon> {{ this.selectedUser.role }}
                        </h6>
                    </b-alert>
                </div>

                <!-- Modal footer -->
                <template #modal-footer="{ ok }">
                    <div class="w-100">
                        <b-button class="me-2 " @click="ok">
                            Cancelar
                        </b-button>
                        <b-button variant="primary" class="float-center" @click="updateUser(), ok()">
                            Confirmar
                        </b-button>

                    </div>
                </template>
            </b-modal>
        </template>


        <!-- MODAL RESET PASSWORD -->
        <b-modal id="modal-resetPassword" title="Resetear contraseña" newPassword.success="false">

            <h6>Ingrese la nueva contraseña</h6>
            <b-form-input id="inputNewPassword1" type="password" v-model=newPassword.newPassword> </b-form-input>
            <h6>Ingrese nuevamente la nueva contraseña</h6>
            <b-form-input id="inputNewPassword2" type="password" v-model=newPassword.newPassword2> </b-form-input>

            <!-- ALERTAS -->
            <b-alert class="mt-3" show variant="primary" v-if="isBusyNewPassword == true">
                <b-spinner class="ms-1 me-1" small variant="primary"></b-spinner> Procesando solicitud...
            </b-alert>

            <b-alert class="mt-3" show variant="success" v-if="newPassword.success == true">
                <b-icon class="ms-1 me-1" icon="check-circle-fill" scale="1"></b-icon> Se actualizó la contraseña
                correctamente
            </b-alert>

            <b-alert class="mt-3" show variant="danger" v-if="newPassword.error != ''">
                <b-icon class="ms-1 me-1" icon="x-circle-fill" scale="1"></b-icon>
                {{ newPassword.error }}
            </b-alert>

            <!-- Modal footer -->
            <template #modal-footer="{ }">
                <div class="w-100">
                    <div v-if="(newPassword.newPassword).length > 5 &
                        newPassword.newPassword == newPassword.newPassword2">
                        <b-button variant="primary" size="sm" class="float-center" @click="alertsErrorReset(), newPass()">
                            Cambiar
                        </b-button>
                    </div>
                </div>
            </template>

        </b-modal>
    </div>
</template>
  
<script>
import { backendData } from "../../main";

export default {
    name: "ConfigUsuariosComponent",
    props: {
    },
    data() {
        return {
            isBusy: false,
            isBusyUpdateUser: false,
            isBusyNewPassword: false,
            isBusyNewUser: false,
            usuarios: Array,
            fields: [
                { key: "username", label: "Username", sortable: true },
                { key: "name", label: "Nombre", sortable: true },
                { key: "role", label: "Rol", sortable: true },
                { key: "actions", label: "" }

            ],
            usersRoles: ['user', 'admin'],
            selectedUser: {},
            actualUserData: {},
            newPassword: { newPassword: '', newPassword2: '', error: '', success: false },
            newData: { error: '', success: false },
            newUserData: {username: null, name: null,password:null},
            newUser: {error: '', success: false }
        }
    },
    computed: {
    },
    created() {
        this.loadData()
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
                        "Authorization": `Bearer ${localStorage.token}`
                    },
                })
                    .then((response) => response.json())
                    .then((json) => this.usuarios = json);

                this.toggleBusy();

            } catch (error) {
                this.toggleBusy();
                console.error("Error al obtener Usuario:", error);
            }
        },

        ///---- METODO NEW USER ----///
        async newUserPost() {
            this.newUserReset()
            this.toggleBusy('newUser')
            // DEMORA ////////////////////
            await this.sleepFunction(1500)
            //////////////////////////////
            try {
                const response = await fetch(`${backendData}/auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.token}`
                    },
                    body: JSON.stringify(this.newUserData)
                })
                //// ACTUAL
                if (!response.ok) {
                    // En caso de error
                    const errorResponse = await response.json();
                    this.newUser.error = errorResponse.error;
                } else {
                    // En caso de Exito
                    this.newUser.success = true
                }
                this.toggleBusy('newUser')

            } catch (error) {
                // En caso de no conectarse al servidor
                this.toggleBusy('newUser')
                this.newUser.error = "Error al conectarse con el servidor";
            }
            this.loadData()
        },

        ///---- METODO UPDATE USER ----///
        async updateUser() {
            this.newDataReset()
            this.toggleBusy('updateUser')
            // DEMORA ////////////////////
            await this.sleepFunction(1500)
            //////////////////////////////
            try {
                const response = await fetch(`${backendData}/auth/user`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.token}`
                    },
                    body: JSON.stringify(this.selectedUser)
                })
                //// ACTUAL
                if (!response.ok) {
                    // En caso de error
                    const errorResponse = await response.json();
                    this.newData.error = errorResponse.error;
                } else {
                    // En caso de Exito
                    this.newData.success = true
                }
                this.toggleBusy('updateUser')

            } catch (error) {
                // En caso de no conectarse al servidor
                this.toggleBusy('updateUser')
                this.newData.error = "Error al conectarse con el servidor";
            }
            this.loadData()
        },

        ///---- METODO RESET PASSWORD----///
        async newPass() {
            this.toggleBusy('newPassword');
            // DEMORA ////////////////////
            await this.sleepFunction(1500)
            //////////////////////////////
            try {
                const response = await fetch(`${backendData}/auth/resetpassword`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.token}`
                    },
                    body: JSON.stringify({
                        username: this.selectedUser.username,
                        newPassword: this.newPassword.newPassword,
                    })
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    this.newPassword.error = errorResponse.message;
                } else {
                    // Manejo de éxito
                    this.newPassword.success = true
                }
                this.toggleBusy('newPassword');
            } catch (error) {
                // Manejo de errores generales que no sean errores de respuesta HTTP
                this.toggleBusy('newPassword');
                this.newPassword.error = "Error al conectarse con el servidor";
            }
        },
        async sleepFunction(ms) {
            await new Promise(r => setTimeout(r, ms));
        },
        toggleBusy(option) {
            if (option == null) {
                this.isBusy = !this.isBusy
            }
            //this.toggleBusy('updateUser')
            if (option == 'updateUser') {
                this.isBusyUpdateUser = !this.isBusyUpdateUser
            }
            //toggleBusy('newPassword')
            if (option == 'newPassword') {
                this.isBusyNewPassword = !this.isBusyNewPassword
            }
            if (option == 'newUser'){
                this.isBusyNewUser = !this.isBusyNewUser
            }
        },
        selectUser(user) {
            this.selectedUser = { ...user };
            this.actualUserData = { ... this.selectedUser }
        },
        newPasswordReset() {
            this.newPassword = { newPassword: '', newPassword2: '', error: '', success: false }
        },
        newDataReset() {
            this.newData.success = false;
            this.newData.error = '';
        },
        alertsErrorReset() {
            this.newPassword.error = '',
            this.newPassword.success = false
        },
        newUserReset(){
            this.newUser = {error: '', success: false }
        }
    }
};
</script>
  
<style scoped>
#divConfigUsuarios {
    background-color: white;
}

input:focus {
    border-color: none;
    box-shadow: none;
}
</style>
  