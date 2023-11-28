<template>
    <div id="divConfigNegocio" class="h-100">
        <div class="flex-grow-1 ">
  <div id="divDatosNegocio" class="flex-grow-1   d-flex flex-column align-items-center  mt-5">
                <h3>Modificar datos del negocio</h3>
                <b-alert v-if="isNewNegocio" show variant="primary">A continuación ingrese los datos de su negocio</b-alert>
                <div class="d-flex flex-row  flex-grow-1 w-75 justify-content-center ">
                    <div class=" col-md-4 me-4">
                        <h6 v-if="isNewNegocio">Nombre (*)</h6>
                        <h6 v-else>Nombre</h6>
                        <b-form-input id="inputNombre" label="Nombre" v-model=negocio.nombre></b-form-input>
                        <h6 v-if="isNewNegocio">Pais (*)</h6>
                        <h6 v-else>Pais</h6>
                        <b-form-input id="inputPais" v-model=negocio.pais> </b-form-input>
                        <h6 v-if="isNewNegocio">Provincia / Estado (*)</h6>
                        <h6 v-else>Provincia / Estado</h6>
                        <b-form-input id="inputProvincia" v-model=negocio.provincia></b-form-input>
                        <h6 v-if="isNewNegocio">Ciudad (*)</h6>
                        <h6 v-else>Ciudad</h6>
                        <b-form-input id="inputCiudad" v-model=negocio.ciudad></b-form-input>
                        <h6 v-if="isNewNegocio">Dirección (*)</h6>
                        <h6 v-else>Dirección</h6>
                        <b-form-input id="inputDireccion" v-model=negocio.direccion></b-form-input>
                    </div>
                    <div class="  col-md-4  ">
                        <h6>Email</h6>
                        <b-form-input id="inputEmail" v-model=negocio.email></b-form-input>
                        <h6>Celular</h6>
                        <b-form-input id="inputCelular" v-model=negocio.celular></b-form-input>
                        <h6>Telefono</h6>
                        <b-form-input id="inputTelefono" v-model=negocio.telefono></b-form-input>
                        <h6>Cuit</h6>
                        <b-form-input id="inputCuit" v-model=negocio.cuit></b-form-input>
                    </div>
                </div>
                <b-button class="mt-3" variant="outline-primary" @click="saveData()">Guardar</b-button>
                <!-- Mensajes -->
                <b-alert class="mt-3" show variant="primary" v-if="isBusy == true">
                    <b-spinner class="ms-1 me-1" small variant="primary"></b-spinner> Procesando solicitud...
                </b-alert>

                <b-alert class="mt-3" show variant="success" v-if="saveSuccess && isBusy == false">
                    <b-icon class="ms-1 me-1" icon="check-circle-fill" scale="1"></b-icon>
                    Se guardaron los cambios con éxito
                </b-alert>

                <b-alert class="mt-3" show variant="danger" v-if="saveError.message && isBusy == false">
                    <b-icon class="ms-1 me-1" icon="x-circle-fill" scale="1"></b-icon>
                    {{ saveError.message }}
                </b-alert>


            </div>
        </div>
    </div>
</template>
  
<script>
import { backendData } from "../../main";

export default {
    name: "ConfigNegocioComponent",
    props: {
    },
    data() {
        return {
            negocio: {
                nombre: null,
                pais: null,
                provincia: null,
                ciudad: null,
                direccion: null,
                email: null,
                celular: null,
                telefono: null,
                cuit: null,
            },
            isBusy: false,
            isNewNegocio: false,
            saveError: { message: null },
            saveSuccess: false
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
                const response = await fetch(`${backendData}/negocio`)
                if (!response.ok) {
                    throw new Error('No se pudo hacer fetch a data');
                }
                const text = await response.text();
                if (text.trim() == '') {
                    this.isNewNegocio = true;
                } else {
                    const negocio = JSON.parse(text);
                    this.negocio = negocio;
                }
            } catch (error) {
                console.error("Error al obtener negocio:", error);
            }
            this.toggleBusy();

        },
        async sleepFunction(ms) {
            await new Promise(r => setTimeout(r, ms));
        },
        async saveData() {
            this.toggleBusy();
            await this.sleepFunction(1500);
            this.saveSuccess = false;
            /// Si ya esta creado el negocio en la DB
            if (!this.isNewNegocio == true) {
                try {
                    const response = await fetch(`${backendData}/negocio`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.token}`
                        },
                        body: JSON.stringify(this.negocio)
                    });

                    if (response.ok) {
                        this.toggleBusy();
                        this.saveSuccess = true;
                        this.saveError.message = null;
                    } else {
                        this.toggleBusy();
                        this.saveSuccess = false;
                        const errorResponse = await response.json();
                        this.saveError.message = errorResponse.message[0];
                    }
                } catch (error) {
                    this.saveSuccess = false;
                    this.saveError.message = "No se pudo conectar al servidor"
                    this.toggleBusy();
                }
            } else {
                // Si el negocio no esta creado en la DB
                // Comprobacion de campos necesarios
                if (this.negocio.nombre == null ||
                    this.negocio.pais == null ||
                    this.negocio.provincia == null ||
                    this.negocio.ciudad == null ||
                    this.negocio.direccion == null) {
                    this.toggleBusy();
                    this.saveError.message = "Faltan datos nesesarios";
                } else {
                    try {
                        const response = await fetch(`${backendData}/negocio`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${localStorage.token}`
                            },
                            body: JSON.stringify(this.negocio)
                        });

                        if (response.ok) {
                            this.toggleBusy();
                            this.isNewNegocio = false;
                            this.saveError.message = null;
                            this.saveSuccess = true;
                        } else {
                            this.toggleBusy();
                            const errorResponse = await response.json();
                            this.saveError.message = errorResponse;
                        }
                    } catch (error) {
                        this.saveSuccess = false;
                        this.saveError.message = "No se pudo conectar al servidor"
                        this.toggleBusy();
                    }
                }
            }
        }
    }
};
</script>
  
<style scoped>
#divConfigNegocio {
    background-color: #ededed;
}

#divDatosNegocio {
    padding: 15px;
    
    margin: auto;
}

#divForm {
    display: flex;
    flex-direction: column;
}

h6 {
    margin-top: 10px;
    margin-left: 3px;
}

.form-control:focus {
    border-color: none;
    box-shadow: none;
}
</style>
  