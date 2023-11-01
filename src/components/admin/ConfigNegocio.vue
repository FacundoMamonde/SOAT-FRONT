<template>
    <div id="divConfigNegocio">
        <div v-if="isBusy">
            <h1>LOADING</h1>
        </div>
        <div v-else>
            <div>
                <h1>Config Negocio</h1>
                <b-form-group id="negocio">
                    <h6>Nombre</h6>
                    <b-form-input id="inputNombre" label="Nombre" :value=negocio.nombre></b-form-input>
                    <h6>Pais</h6>
                    <b-form-input id="inputPais" :value=negocio.pais></b-form-input>
                    <h6>Provincia</h6>
                    <b-form-input id="inputProvincia" :value=negocio.provincia></b-form-input>
                    <h6>Ciudad</h6>
                    <b-form-input id="inputCiudad" :value=negocio.ciudad></b-form-input>
                    <h6>Direccion</h6>
                    <b-form-input id="inputDireccion" :value=negocio.direccion></b-form-input>
                    <h6>Email</h6>
                    <b-form-input id="inputEmail" :value=negocio.email></b-form-input>
                    <h6>Celular</h6>
                    <b-form-input id="inputCelular" :value=negocio.celular></b-form-input>
                    <h6>Telefono</h6>
                    <b-form-input id="inputTelefono" :value=negocio.telefono></b-form-input>
                    <h6>Cuit</h6>
                    <b-form-input id="inputCuit" :value=negocio.cuit></b-form-input>
                    <b-button variant="outline-primary" @click="saveData()">Guardar</b-button>
                </b-form-group>
            </div>
        </div>
    </div>
</template>
  
<script>
//import { backendData } from "../main";

export default {
    name: "ConfigNegocioComponent",
    props: {
    },
    data() {
        return {
            negocio: Object,
            isBusy: false,
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
            this.toggleBusy()
            await fetch(`http://localhost:3000/negocio`)
                .then((response) => response.json())
                .then((negocio) => {
                    this.negocio = negocio;
                    this.toggleBusy()
                    console.log(negocio)
                })
                .catch((error) => {
                    console.error("Error al obtener negocio:", error);
                });
        },

        async saveData() {
            this.toggleBusy();
            let datos = {
                "nombre": this.negocio.nombre,
                "pais": this.negocio.pais,
                "provincia": this.negocio.provincia,
                "ciudad": this.negocio.ciudad,
                "direccion": this.negocio.direccion,
                "email": this.negocio.email,
                "celular": this.negocio.celular,
                "telefono": this.negocio.telefono,
                "cuit": this.negocio.cuit
            }
            await fetch(`http://localhost:3000/negocio`, {
                method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(datos)
            })
                .then((response) => response.json())
                .then((json) => console.log(json));
            this.toggleBusy();
        }
    }
};
</script>
  
<style scoped>
#divConfigNegocio {
    background-color: white
}
</style>
  