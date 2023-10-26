<template>
    <div>
      <button
        @click="generatePDF"
        class="btn btn-primary btn-sm m-0"
        style="width: 100px"
      >
        <i class="bi bi-printer"></i> Imprimir
      </button>
    </div>
  </template>
  
  <script>
  import pdfMake from "pdfmake/build/pdfmake";
  import pdfFonts from "pdfmake/build/vfs_fonts";
  
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  
  export default {
    props: {
      orderData: {
        type: Object,
        required: true,
      },
    },
    methods: {
      generatePDF() {
        const docDefinition = {
          content: [
            {
              text: "SOAT",
              style: "header",
            },
          ],
          styles: {
            header: {
              fontSize: 30,
              bold: true,
              alignment: "center",
              margin: [0, 0, 0, 10],
            },
            subheader: {
              fontSize: 16,
              bold: true,
              margin: [0, 10, 0, 5],
            },
            label: {
              fontSize: 12,
              bold: true,
              margin:[0, 10, 0, 5]
            },
            value: {
              fontSize: 12,
            },
            total: {
              fontSize: 16,
              bold: true,
              alignment: "right",
              margin: [0, 10, 0, 5],
            },
            totalValue: {
              fontSize: 16,
              alignment: "right",
            },
            footer: {
              fontSize: 12,
              bold: true,
              alignment: "center",
              margin: [0, 10, 0, 0],
            },
          },
        };
  
        // Función para agregar subtítulo y contenido de la sección
        function addSection(subheaderText, contentArray) {
          docDefinition.content.push({
            text: subheaderText,
            style: "subheader",
          });
          docDefinition.content.push({
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 10,
                x2: 520,
                y2: 10,
                lineWidth: 1,
              },
            ],
          });
          contentArray.forEach((item) => docDefinition.content.push(item));
        }
  
        // Detalles del Servicio
        addSection("Detalles del Servicio", [
          { text: `Orden #: ${this.orderData.id.toString()}`, style: "label" },
          { text: `Fecha de Ingreso: ${this.orderData.fechaIngreso}`, style: "label" },
        ]);
  
        // Datos del Cliente
        addSection("Datos del Cliente", [
          { text: `Nombre: ${this.orderData.cliente.nombre}` || "Nombre de Cliente", style: "label" },
        
          { text: `Teléfono: ${this.orderData.cliente.telefono}`|| "Celular del cliente", style: "label" },
         
        ]);
  
        // Detalles del Equipo
        addSection("Datos del Equipo", [
        { text: `Tipo de equipo: ${ this.orderData.equipo.modelo.tipoEquipo.nombre}` ||
              "Tipo de equipo", style: "label" },
          { text: `Marca: ${ this.orderData.equipo.modelo.marca.nombre}` ||
              "Marca", style: "label" },
          { text: `Modelo: ${this.orderData.equipo.modelo.nombre}`|| "Modelo", style: "label" },
        
          { text: `Número de Serie: ${this.orderData.equipo.n_serie}`|| "n de serie" , style: "label" },
          
        ]);
  
        // Otros detalles
        addSection("Otros Detalles", [
          { text: `Accesorios: ${ this.orderData.accesorio !== null  && this.orderData.accesorio !== undefined ? this.orderData.accesorio : "N/A"} `|| "Sin Accesorios", style: "label" },
          {
    text: `Descripción de la Falla: ${this.orderData.falla !== null && this.orderData.falla !== undefined ? this.orderData.falla : "N/A"}`,
    style: "label"
  },
  {
    text: `Informe: ${this.orderData.informe !== null && this.orderData.informe !== undefined ? this.orderData.informe : "N/A"}`,
    style: "label"
  },
  {
    text: `Presupuesto: ${this.orderData.presupuesto !== null && this.orderData.presupuesto !== undefined ? this.orderData.presupuesto : "N/A"}`,
    style: "label"
  }
        ]);
  
        // Total a Pagar
        docDefinition.content.push({
          text: "Total a Pagar:",
          style: "total",
        });
        docDefinition.content.push({
          text:`$ ${ this.orderData.importe }`,
          style: "totalValue",
        });
  
      
        docDefinition.content.push({
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 10,
              x2: 520,
              y2: 10,
              lineWidth: 2,
            },
          ],
        });
     
  
        pdfMake.createPdf(docDefinition).open();
      },
    },
  };
  </script>
  