<template>
    <div id="divConfigNegocio">
        <div v-if="isBusy">
            <h1>LOADING</h1>
        </div>
        <div v-else>

            <div id="divDatosNegocio">
                <h2>Datos del negocio</h2>

                <div class="d-flex flex-row">
                    <div class="col-md-6">
                        <h6>Nombre</h6>
                        <b-form-input id="inputNombre" label="Nombre" v-model=negocio.nombre></b-form-input>
                        <h6>Pais</h6>
                        <b-form-input id="inputPais" v-model=negocio.pais> </b-form-input>
                        <h6>Provincia / Estado</h6>
                        <b-form-input id="inputProvincia" v-model=negocio.provincia></b-form-input>
                        <h6>Ciudad</h6>
                        <b-form-input id="inputCiudad" v-model=negocio.ciudad></b-form-input>
                        <h6>Direccion</h6>
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
            isNewNegocio: false
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
                    throw new Error('Failed to fetch data');
                }
                console.log(response.text)
                const text = await response.text();
                if (text.trim() == '') {
                    this.isNewNegocio = true;
                } else {
                    const negocio = JSON.parse(text);
                    this.negocio = negocio;
                }
            } catch (error) {
                console.error("Error al obtener negocio:", error);
            } finally {
                this.toggleBusy();
            }
        },
        async saveData() {
            this.toggleBusy();
            if (!this.isNewNegocio == true) {
                await fetch(`${backendData}/negocio`, {
                    method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify(this.negocio)
                })
                    .then((response) => response.json())
                    .then((json) => console.log(json));
                this.toggleBusy();
            } else {
                console.log("ejecutando POST")
                const response = await fetch(`${backendData}/negocio`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.negocio),
                });

                if (!response.ok) {
                    throw new Error('Failed to create new negocio');
                }
                this.toggleBusy()
                const json = await response.json();
                console.log(json);
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
  