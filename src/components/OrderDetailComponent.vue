<template>
  <div id="divOrderDetail" class="card" style="min-width: 360px; max-width: 1000px; border-radius: 0% !important ">
    <div v-if="orderData !=null">
      <div id="orderDetailContainer" style="padding-left: 15px">
        <div class="row pt-2">
          <!-- DIV NUMERO Y FECHA DE ORDEN -->
          <div class="col-6 p-0">
            <p class="h2 ml-1 mb-0 pt-1">Orden # {{ orderData.id }}</p>
            <p class="badge bg-secondary">
              <i class="bi bi-calendar3"></i> {{ orderData.fechaIngreso }}
            </p>
          </div>
          <div class="col-6">
            <!-- DIV DATOS CLIENTE -->
            <div class="d-flex flex-row">
              <div class="col-md-1" style="width: 50px">
                <i class="bi bi-person-circle col-md-8" style="font-size: 40px"></i>
                <!-- Icono de Cliente-->
              </div>
              <div class="col-md-8">
                <p v-if="orderData.cliente.nombre" class="m-0 pt-2">
                  {{ orderData.cliente.nombre }}
                </p>
                <p v-else class="m-0 pt-2">Nombre de Cliente</p>
                <p v-if="orderData.cliente.telefono" class="mt-0">
                  {{ orderData.cliente.telefono }}
                </p>
                <p v-else class="mt-0">Celular del cliente</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-6 p-0">
            <!-- DIV EQUIPO -->
            <div class="d-flex flex-row">
              <div class="col-md-1" style="width: 50px">
                <i class="bi bi-laptop col-md-8" style="font-size: 40px"></i>
                <!-- Icono de Equipo-->
              </div>
              <div class="col-md-8">
                <p v-if="orderData.equipo.modelo.marca" class="m-0 pt-2">
                  {{ orderData.equipo.modelo.marca.nombre }}
                </p>
                <p v-else class="m-0 pt-2">Tipo de Equipo - Marca</p>
                <p v-if="orderData.equipo.modelo" class="m-0">
                  {{ orderData.equipo.modelo.nombre }}
                </p>
                <p v-else class="m-0">Modelo</p>
                <p v-if="orderData.equipo.n_serie" class="m-0">
                  {{ orderData.equipo.n_serie }}
                </p>
                <p v-else class="m-0">n de serie</p>
              </div>
            </div>
          </div>
          <div class="col-6">
            <!-- DIV ACCESORIOS -->
            <div class="d-flex flex-row">
              <div class="col-md-1" style="width: 50px">
                <i class="bi bi-clipboard2-check col-md-8" style="font-size: 40px"></i>
                <!-- Icono de Accesorios-->
              </div>
              <div class="col-md-8">
                <p v-if="orderData.accesorio" class="m-0 pt-2">
                  {{ orderData.accesorio }}
                </p>
                <p v-else class="m-0 pt-2">Sin Accesorios</p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="orderData.estado < 2">
          <h5 class="mt-3">Descripción de la falla</h5>
          <textarea v-model="orderData.falla" class="col-11 p-0 m-0"
            style="height: 100px; min-height: 80px; max-height: 120px; width: 95%" name="" id="" cols="30" rows="10">
        </textarea>
        </div>
        <div v-if="orderData.estado != 0">
          <h5 class="mt-3">Diagnóstico</h5>
          <textarea v-model="orderData.informe" class="col-11 p-0 m-0"
            style="height: 100px; min-height: 80px; max-height: 120px; width: 95%" name="" id="" cols="30" rows="10"
            @input="changeInforme"></textarea>

          <div v-if="orderData.estado >= 2">
            <h5 class="mt-3">Presupuesto</h5>
            <textarea v-model="orderData.presupuesto" class="col-11 p-0 m-0"
              style="height: 100px; min-height: 80px; max-height: 120px; width: 95%" name="" id="" cols="30" rows="10"
              @input="changePresupuesto"></textarea>
          </div>

          <div v-if="orderData.estado >= 2" class="d-flex flex-row" style="width: 97%">
            <div class="p-2 w-100">
              <span class="align-middle">$ </span>
              <input v-model="orderData.importe" type="text" style="width: 100px" @input="changePrice()" />
            </div>
            <div class="p-2 flex-shrink-1">
              <PDFGenerator :orderData="orderData" />
            </div>
          </div>
        </div>
      </div>

      <div class="w-100 d-flex justify-content-end card-footer">
        <button v-if="orderData.estado == 2" class="btn btn-danger me-3" @click="changeStatusNA(orderData.id)">
          No aprobado
        </button>
        <button v-if="orderData.estado != 5" class="btn btn-success" @click="changeStatus(orderData.id)">
          {{ nextButton }}
        </button>
      </div>
    </div>
    <div v-else class="h-100 d-flex align-items-center justify-content-center ">
      <!-- Contenido cuando orderData es nulo -->
      <p class="text-center ">No se ha seleccionado ninguna orden.</p>
    </div>
  </div>
</template>

<script>
import { bus, backendData } from "../main";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import PDFGenerator from "@/components/PDFGenerator.vue";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  components: {
    PDFGenerator,
  },
  name: "OrderDetailComponent",
  
  data() {
    return {
      orderData: null,
      typingTimer: null,
      
    };
  },
  props: {
    nextButton: {
      type: String,
      default: '',
    },
  },
  beforeMount() {
    bus.$on("row-selected", (orderID) => {
      this.getOrderById(orderID);
    });
    bus.$on("no-order-selected", () => {
      this.orderData = null;
    });
  },
  watch: {
    orderID(newOrderID) {
      this.getOrderById(newOrderID);
    },
    orderData(){
      this.orderData
    }
  },
  methods: {

    generatePDF() {},
    changeInforme() {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.changeOrderData(this.orderData.informe, "informe");
      }, 1000);
    },
    changePresupuesto() {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.changeOrderData(this.orderData.presupuesto, "presupuesto");
      }, 1000);
    },

    changePrice() {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.changeOrderData(this.orderData.importe, "importe");
      }, 1000);
    },

    changeOrderData(value, section) {
      const orderId = this.orderData.id;
      const newData = {
        [section]: value,
        id_cliente:this.orderData.cliente.id,
        id_equipo:this.orderData.equipo.id
      };
      fetch(`${backendData}/orden/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error(
              "Error al actualizar el informe: " + response.status
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },

    getOrderById(orderId) {
      fetch(`${backendData}/orden/${orderId}`)
        .then((response) => response.json())
        .then((order) => {
          this.orderData = order;
        })
        .catch((error) => {
          console.error("Error al obtener la orden:", error);
        });
    },

    changeStatus(orderId) {
      fetch(`${backendData}/orden/${orderId}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            bus.$emit("cambiar-estado");
          } else {
            console.error("Error al actualizar la orden:", response.status);
          }
        })
        .catch((error) => {
          console.error("Error en la llamada a la API:", error);
        });
    },
    //':id/presupuestoNA'
    changeStatusNA(orderId) {
      fetch(`${backendData}/orden/${orderId}/presupuestoNA`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("La orden se actualizó correctamente");
            bus.$emit("cambiar-estado");
          } else {
            console.error("Error al actualizar la orden:", response.status);
          }
        })
        .catch((error) => {
          console.error("Error en la llamada a la API:", error);
        });
    },
  },
};
</script>
<style scoped>
#orderDetailContainer {
  min-height: 520px !important;
}
</style>

