<template>
    <div id="divConfigNegocio">
        <div v-if="isBusy">
            <h1>LOADING</h1>
        </div>
        <div v-else>

            <div id="divDatosNegocio">
                <h3>Modificar datos del negocio</h3>
                <b-alert v-if="isNewNegocio" show variant="primary">A continuación ingrese los datos de su negocio</b-alert>
                <div class="d-flex flex-row">
                    <div class="col-md-6">
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
                    <div class="col-md-6 ms-4">
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
                <div class="mt-3">
                    <b-alert v-if="saveSuccess" variant="success" show>Cambios guardados con éxito</b-alert>
                    <b-alert v-if="saveError.message != null" variant="danger" show>{{ saveError.message }}</b-alert>
                </div>


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
        async saveData() {
            this.toggleBusy();

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
                        const errorResponse = await response.json();
                        this.saveError.message = errorResponse;
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
    background-color: white
}

#divDatosNegocio {
    padding: 15px;
    width: 600px;
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
  