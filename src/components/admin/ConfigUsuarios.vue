<template>
    <div id="divConfigUsuarios">
        <h1>Usuarios</h1>
        <div>
            <b-table striped hover :items="usuarios" :fields="fields" label-sort-asc="" label-sort-desc=""
                label-sort-clear="">
                <template v-slot:cell(actions)="data">
                    <!-- Boton editar-->
                    <span class="p-0 m-0">
                        <a @click="selectUser(data.item)">
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
        </div>

        <!-- MODAL EDITAR-->
        <b-modal id="modal-editUser" title="Editar Usuario">
            <h6>Username</h6>
            <b-form-input id="inputEmail" v-model=selectedUser.username> </b-form-input>
            <h6>Nombre</h6>
            <b-form-input id="inputNombre" label="Nombre" v-model=selectedUser.name></b-form-input>
            <h6>Rol</h6>
            <b-form-select id="table-style-variant" v-model="selectedUser.role" :options="usersRoles">
            </b-form-select>
            <!-- Modal footer -->
            <template #modal-footer="{ ok }">
                <div class="w-100">
                    <b-button variant="primary" size="sm" class="float-center" @click="ok(), updateUser()">
                        Guardar
                    </b-button>
                </div>
            </template>
        </b-modal>

        <!-- MODAL RESET PASSWORD -->
        <b-modal id="modal-resetPassword" title="Resetear contraseña" newPassword.success="false">

            <h6>Ingrese la nueva contraseña</h6>
            <b-form-input id="inputNewPassword1" v-model=newPassword.newPassword> </b-form-input>
            <h6>Ingrese nuevamente la nueva contraseña</h6>
            <b-form-input id="inputNewPassword2" v-model=newPassword.newPassword2> </b-form-input>

            <b-alert show variant="warning" v-if="newPassword.error != ''">
                {{ newPassword.error }}
            </b-alert>

            <b-alert show variant="success" v-if="newPassword.success == true">
                Se cambió la contraseña con exitó
            </b-alert>

            <!-- Modal footer -->
            <template #modal-footer="{ }">
                <div class="w-100">
                    <div v-if="newPassword.newPassword != '' &
                        newPassword.newPassword == newPassword.newPassword2">
                        <b-button variant="primary" size="sm" class="float-center"
                            @click="newPasswordErrorReset(), newPass()">
                            Guardar
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
            usuarios: Array,
            fields: [
                { key: "username", label: "Username", sortable: true },
                { key: "name", label: "Nombre", sortable: true },
                { key: "role", label: "Rol", sortable: true },
                { key: "actions", label: "" }

            ],
            usersRoles: ['user', 'admin'],
            selectedUser: {},
            editUser: {},
            newPassword: { newPassword: '', newPassword2: '', error: '', success: false }
        }
    },
    computed: {
    },
    created() {
        this.loadData()
    },
    methods: {
        toggleBusy() {
            this.isBusy = !this.isBusy
        },
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
                console.error("Error al obtener negocio:", error);
            }
            this.toggleBusy();

        },
        selectUser(user) {
            this.selectedUser = { ...user };
        },
        newPasswordReset() {
            this.newPassword = { newPassword: '', newPassword2: '', error: '', success: false }
        },
        newPasswordErrorReset() {
            this.newPassword.error = '',
                this.newPassword.success = false
        },
        async updateUser() {
            this.toggleBusy();
            let respuesta
            try {
                await fetch(`${backendData}/auth/user`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.token}`
                    },
                    body: JSON.stringify(this.selectedUser)
                })
                    .then((response) => response.json())
                    .then((json) => respuesta = json);
                console.log(respuesta)

                this.toggleBusy();

            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
            this.toggleBusy();


            this.loadData()
        },

        /* METODO RESET PASSWORD */

        async newPass() {
            this.toggleBusy();
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
                    // Manejo de errores en caso de que la respuesta no sea exitosa (por ejemplo, un error HTTP)
                    const errorResponse = await response.json();
                    this.newPassword.error = errorResponse.message;
                } else {
                    // Manejo de éxito
                    this.newPassword.success = true
                    // Realizar acciones adicionales si es necesario
                }

                this.toggleBusy();
            } catch (error) {
                // Manejo de errores generales que no sean errores de respuesta HTTP
                this.newPassword.error = error.message;
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
</style>
  