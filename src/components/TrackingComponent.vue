<template>
    <div >

  <b-button variant="dark" id="fechas">
    Seguimiento
  </b-button>
  <b-tooltip target="fechas" triggers="hover"  >
    <p v-if="orden.fechaIngreso">Ingreso: {{ orden.fechaIngreso }}</p>
    <p v-if="orden.fechaDiagnosticada" >Diagnostico: {{ orden.fechaDiagnosticada }}</p>
    <p v-if="orden.fechaPresupuestada">Presupuesto: {{ orden.fechaPresupuestada }}</p>
    <p v-if="orden.fechaPendiente">Pendiente: {{ orden.fechaPendiente }}</p>
    <p v-if="orden.fechaTerminada">Terminada: {{ orden.fechaTerminada }}</p>
    <p v-if="orden. fechaEntregada" class="no-wrap">Entregada: {{ orden.fechaEntregada }}</p>
  </b-tooltip>
    </div>
  </template>
  
  <script>
  export default {
    name: "TrackingDates",
    props: {
      orden: {
        type: Object,
        default: null,
      },
    },
    
    data() {
      return {
        newAccesorio: this.orden.accesorio,
      };
    },
  };
  </script>
  