<template>
    <b-card no-body>
        <b-tabs card>
            <!--//// TAB DE EDITAR USUARIO ////-->
            <b-tab @click="resetUpdateUserStatus(), loadUserData()" title="Perfil" active>
                <h5 class="mb-4">Editar mis datos</h5>

                <h6>Username</h6>
                <b-input id="inputUsername" type="text" autocomplete="off" v-model=selectedUser.username> </b-input>
                <h6>Nombre</h6>
                <b-input id="inputNombre" label="Nombre" v-model=selectedUser.name></b-input>

                <!-- ALERTS -->
                <b-alert class="mt-3" show variant="primary" v-if="isBusyEditUser == true">
                    <b-spinner class="ms-1 me-1" small variant="primary"></b-spinner> Procesando solicitud...
                </b-alert>

                <b-alert class="mt-3" show variant="success" v-if="updateUserStatus.success == true">
                    <b-icon class="ms-1 me-1" icon="check-circle-fill" scale="1"></b-icon>
                    Se modificó {{ selectedUser.username }} correctamente
                </b-alert>

                <b-alert class="mt-3" show variant="danger" v-if="updateUserStatus.error != ''">
                    <b-icon class="ms-1 me-1" icon="x-circle-fill" scale="1"></b-icon>
                    {{ updateUserStatus.error }}
                </b-alert>

                <!-- Modal footer -->
                <div>
                    <div v-if="!updateUserStatus.success">
                        <b-button v-if="oldData.name != selectedUser.name
                            || oldData.username != selectedUser.username" v-b-modal.modal-confirmChange
                            variant="primary">Guardar</b-button>
                        <b-button v-else v-b-modal.modal-confirmChange variant="primary" disabled>Guardar</b-button>
                    </div>
                </div>
            </b-tab>

            <!-- MODAL CONFIRMACION DE CAMBIOS -->
            <template>
                <b-modal id="modal-confirmChange" title="Confirmar cambios">
                    <h5 class="mb-3">Desea afectuar los siguientes cambios?</h5>
                    <div v-if="this.selectedUser.username != this.oldData.username">
                        <b-alert class="mt-3" show variant="warning">
                            <h6>Username: </h6>
                            <h6>{{ this.oldData.username }} <b-icon icon="arrow-right"></b-icon> {{
                                this.selectedUser.username }}</h6>
                        </b-alert>
                    </div>
                    <div v-if="this.selectedUser.name != this.oldData.name">
                        <b-alert class="mt-3" show variant="warning">
                            <h6>Nombre: </h6>
                            <h6>{{ this.oldData.name }} <b-icon icon="arrow-right"></b-icon> {{
                                this.selectedUser.name }}
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



            <!--//// TAB DE SEGURIDAD ////-->
            <b-tab @click="changePasswordReset()" title="Seguridad">
                <h5 class="mb-4">Cambio de contraseña</h5>

                <h6>Ingrese la contraseña actual</h6>
                <b-form-input id="inputOldPassword" v-model=changePassword.oldPassword type="password"></b-form-input>

                <h6 class="mt-5">Ingrese la nueva contraseña</h6>
                <b-form-input id="inputNewPassword1" v-model=changePassword.newPassword type="password">
                </b-form-input>
                <h6>Ingrese nuevamente la nueva contraseña</h6>
                <b-form-input id="inputNewPassword2" v-model=changePassword.newPassword2 type="password">
                </b-form-input>


                <!-- ALERTS -->
                <b-alert class="mt-3" show variant="primary" v-if="isBusyChangePassword">
                    <b-spinner class="ms-1 me-1" small variant="primary"></b-spinner> Procesando solicitud...
                </b-alert>
                <b-alert class="mt-3" show variant="success" v-if="changePassword.success">
                    <b-icon class="ms-1 me-1" icon="check-circle-fill" scale="1"></b-icon>
                    Se modificó contraseña correctamente
                </b-alert>
                <b-alert class="mt-3" show variant="danger" v-if="changePassword.error != ''">
                    <b-icon class="ms-1 me-1" icon="x-circle-fill" scale="1"></b-icon>
                    {{ changePassword.error }}
                </b-alert>

                <!-- Modal footer -->
                <div class="w-100 text-center">
                    <div v-if="(changePassword.newPassword).length > 5 &
                        changePassword.newPassword == changePassword.newPassword2">
                        <b-button variant="primary" size="s" class="float-center"
                            @click="changePasswordErrorReset(), changePass()">
                            Cambiar
                        </b-button>
                    </div>
                </div>
            </b-tab>
        </b-tabs>
    </b-card>
</template>
  
<script>
import { backendData } from "../../main";

export default {
    name: "ConfigUsuarioComponent",
    props: {
    },
    data() {
        return {
            isBust:false,
            isBusyEditUser: false,
            isBusyChangePassword:false,
            editUser: {},
            selectedUser: Object,
            oldData: Object,
            changePassword: { oldPassword: '', newPassword: '', newPassword2: '', error: '', success: false },
            updateUserStatus: { success: false, error: '' }
        }
    },
    computed: {
    },
    created() {
        this.loadUserData()
    },
    methods: {
        async loadUserData() {
            let username = localStorage.getItem('username');
            try {
                await fetch(`${backendData}/auth/user/${username}`, {
                    method: "Get",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.token}`
                    }
                })
                    .then((response) => response.json())
                    .then((json) => this.selectedUser = json);


                this.oldData = { ...this.selectedUser }
                this.toggleBusy();

            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
            this.toggleBusy();

        },
        toggleBusy() {
            this.isBusy = !this.isBusy
        },
        toggleBusyEditUser() {
            this.isBusyEditUser = !this.isBusyEditUser
        },
        toggleBusyChangePassword() {
            this.isBusyChangePassword = !this.isBusyChangePassword
        },
        resetUpdateUserStatus() {
            this.updateUserStatus = { success: false, error: '' }
        },
        changePasswordReset() {
            this.changePassword = { oldPassword: '', newPassword: '', newPassword2: '', error: '', success: false }
        },
        changePasswordErrorReset() {
            this.changePassword.error = '',
                this.changePassword.success = false
        },
        async sleepFunction(ms) {
            await new Promise(r => setTimeout(r, ms));
        },
        async updateUser() {
            this.toggleBusyEditUser();
            await this.sleepFunction(1500)
            this.resetUpdateUserStatus();

            try {
                const response = await fetch(`${backendData}/auth/user`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.token}`
                    },
                    body: JSON.stringify(this.selectedUser)
                });

                if (response.ok) {
                    // Si la respuesta es exitosa, procesa los datos si es necesario
                    this.updateUserStatus.success = true;
                    this.toggleBusyEditUser();
                    this.loadUserData();
                    // Hacer algo con json si es necesario
                } else {
                    // Si la respuesta no es exitosa (por ejemplo, código de estado HTTP no exitoso),
                    // maneja el error aquí
                    const errorResponse = await response.json();
                    this.updateUserStatus.error = errorResponse.error;
                }
            } catch (error) {
                // Manejo de errores generales
                this.toggleBusyEditUser()
                this.updateUserStatus.error = error.message;
            }
        },
        async changePass() {
            this.toggleBusyChangePassword();
            try {
                const response = await fetch(`${backendData}/auth/password`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.token}`
                    },
                    body: JSON.stringify({
                        username: this.selectedUser.username,
                        oldPassword: this.changePassword.oldPassword,
                        newPassword: this.changePassword.newPassword,
                    })
                });

                if (!response.ok) {
                    // Manejo de errores en caso de que la respuesta no sea exitosa (por ejemplo, un error HTTP)
                    this.toggleBusyChangePassword();
                    const errorResponse = await response.json();
                    this.changePassword.error = errorResponse.message;
                } else {
                    this.toggleBusyChangePassword();
                    // Manejo de éxito
                    this.changePassword.success = true
                    // Realizar acciones adicionales si es necesario
                }
            } catch (error) {
                // Manejo de errores generales que no sean errores de respuesta HTTP
                this.toggleBusyChangePassword();
                this.changePassword.error = error.message;
            
            }
        }
    }
};
</script>
  
<style scoped>
#divConfigUsuarios {
    background-color: white;
}

input {
    margin-top: 2px;
    margin-bottom: 8px;
}

input:focus {
    border-color: none;
    box-shadow: none;
}
</style>
  