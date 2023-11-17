<template>
  <div>
    <b-button variant="dark" id="fechas">
      <i class="bi bi-clock-history"></i>
    </b-button>
    <b-tooltip target="fechas" triggers="hover">
      <p v-for="fecha in fechasMostradas" :key="fecha.label">
        {{ fecha.label }}: {{ fecha.value }}
      </p>
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
  computed: {
    fechasMostradas() {
      const fechas = [
        { label: "Ingreso", value: this.orden.fechaIngreso },
        { label: "Diagnostico", value: this.orden.fechaDiagnosticada },
        { label: "Presupuesto", value: this.orden.fechaPresupuestada },
        { label: "Pendiente", value: this.orden.fechaPendiente },
        { label: "Terminada", value: this.orden.fechaTerminada },
        { label: "Entregada", value: this.orden.fechaEntregada },
      ];

      return fechas.filter((fecha) => fecha.value);
    },
  },
};
</script>
