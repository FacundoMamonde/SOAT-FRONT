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

                <!-- Mensajes de Errores-->
                <b-alert show variant="warning" v-if="updateUserStatus.error != ''">
                    {{ this.updateUserStatus.error }}
                </b-alert>
                <b-alert show variant="success" v-if="updateUserStatus.success == true">
                    Datos guardados con exito
                </b-alert>

                <!-- Boton de guardar-->
                <div v-if="oldData != selectedUser" class="w-100 text-center">
                    <b-button type="button" variant="primary" size="s" @click="updateUser()">
                        Guardar
                    </b-button>
                </div>
            </b-tab>


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

                <b-alert show variant="warning" v-if="changePassword.error != ''">
                    {{ changePassword.error }}
                </b-alert>

                <b-alert show variant="success" v-if="changePassword.success == true">
                    Se cambió la contraseña con exitó
                </b-alert>
                <!-- Modal footer -->
                <div class="w-100 text-center" >
                    <div v-if="changePassword.newPassword != '' &
                        changePassword.oldPassword != '' &
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
            isBusy: false,
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
        async updateUser() {
            this.toggleBusy();
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
                    this.toggleBusy();
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
                this.updateUserStatus.error = error.message;
            }
        },
        async changePass() {
            this.toggleBusy();
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
                    const errorResponse = await response.json();
                    this.changePassword.error = errorResponse.message;
                } else {
                    // Manejo de éxito
                    this.changePassword.success = true
                    // Realizar acciones adicionales si es necesario
                }

                this.toggleBusy();
            } catch (error) {
                // Manejo de errores generales que no sean errores de respuesta HTTP
                this.changePassword.error = error.message;
                this.toggleBusy();
            }
        }
    }
};
</script>
  
<style scoped>
#divConfigUsuarios {
    background-color: white;
}

input{
    margin-top: 2px;
    margin-bottom: 8px;
}

input:focus {
    border-color: none;
    box-shadow: none;
}
</style>
  