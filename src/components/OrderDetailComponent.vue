<template>
  <div
    id="divOrderDetail"
    class="card"
    style="min-width: 360px; max-width: 1000px; border-radius: 0% !important"
  >
    <div
      v-if="isBusy"
      class="text-center h-100 d-flex align-items-center justify-content-center"
    >
      <b-spinner variant="primary"></b-spinner>
    </div>
    <div v-else class="h-100">
      <div v-if="orderData != null">
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
                  <i
                    class="bi bi-person-circle col-md-8"
                    style="font-size: 40px"
                  ></i>
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
                  <i
                    class="bi bi-clipboard2-check col-md-8"
                    style="font-size: 40px"
                  ></i>
                  <!-- Icono de Accesorios-->
                </div>
                <div class="col-md-8">
                  <div class="d-flex">
                    <p v-if="orderData.accesorio" class="m-0 pt-2">
                      {{ orderData.accesorio }}
                    </p>
                    <p v-else class="m-0 pt-2">Sin Accesorios</p>
                    <ChangeAccesories
                      v-if="this.orderData.estado < 4"
                      :orden="this.orderData"
                      @accesorioCambiado="actualizarAccesorio"
                    ></ChangeAccesories>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="orderData.estado < 2">
            <h5 class="mt-3">Descripción de la falla</h5>
            <textarea
              disabled
              v-model="orderData.falla"
              class="col-11 p-0 m-0"
              style="
                height: 100px;
                min-height: 80px;
                max-height: 120px;
                width: 95%;
              "
              name=""
              id=""
              cols="30"
              rows="10"
            >
            </textarea>
          </div>
          <div v-if="orderData.estado != 0">
            <h5 class="mt-3">Diagnóstico</h5>
            <textarea
              v-model="orderData.informe"
              class="col-11 p-0 m-0"
              style="
                height: 100px;
                min-height: 80px;
                max-height: 120px;
                width: 95%;
              "
              name=""
              id=""
              cols="30"
              rows="10"
              :class="{ 'border-danger': !this.orderData.informe && showError }"
              @input="changeInforme"
            ></textarea>

            <div v-if="orderData.estado >= 2">
              <h5 class="mt-3">Presupuesto</h5>
              <textarea
                :disabled="orderData.estado > 2"
                :class="{
                  'border-danger': !this.orderData.presupuesto && showError,
                }"
                v-model="orderData.presupuesto"
                class="col-11 p-0 m-0"
                style="
                  height: 100px;
                  min-height: 80px;
                  max-height: 120px;
                  width: 95%;
                "
                name=""
                id=""
                cols="30"
                rows="10"
                @input="changePresupuesto"
              ></textarea>
            </div>

            <div
              v-if="orderData.estado >= 2"
              class="d-flex flex-row"
              style="width: 97%"
            >
              <div class="p-2 w-100">
                <span class="align-middle">$ </span>
                <input
               
                :disabled="orderData.estado > 2"
                  :class="{
                    'border-danger': !this.orderData.importe && showError,
                  }"
                  v-model="orderData.importe"
                  type="number"
                  style="width: 100px"
                  @input="changePrice()"
                />
              </div>
              <div class="p-2 flex-shrink-1">
                <PDFGenerator :orderData="orderData " />
              </div>
            </div>
          </div>
        </div>

        <div class="w-100 d-flex justify-content-between card-footer">
          <div class="d-flex">
          <TrackingDates :orden="this.orderData" class="me-3"/>

         <DeleteOrder :orden="this.orderData" @orden-eliminada="handleOrdenEliminada"/>
        </div>
          <div>
          <button
          :disabled="this.isChangingData"
            v-if="orderData.estado == 4 || orderData.estado == 3"
            class="btn btn-secondary me-3"
            @click="rebudget(orderData.id)"
          >
            Presupuestar
          </button>
          <button
          :disabled="this.isChangingData"
            v-if="orderData.estado == 2"
            class="btn btn-danger me-3"
            @click="changeStatusNA(orderData.id)"
          >
            No aprobado
          </button>
          <button
            :disabled="this.isChangingData"
            v-if="orderData.estado != 5"
            class="btn btn-success"
            @click="handleOk(orderData.id)"
          >
            {{ nextButton }}
          </button>
        </div>
      </div>
      </div>
      <div
        v-else
        class="h-100 d-flex align-items-center justify-content-center"
      >
        <!-- Contenido cuando orderData es nulo -->
        <p class="text-center">No se ha seleccionado ninguna orden.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { bus, backendData } from "../main";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import PDFGenerator from "@/components/PDFGenerator.vue";
import TrackingDates from"@/components/TrackingComponent.vue"
import ChangeAccesories from "@/components/ChangeAccesories.vue";
import DeleteOrder from "@/components/DeleteOrder.vue";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  components: {
    PDFGenerator,
    ChangeAccesories,
    TrackingDates,
    DeleteOrder
  },
  name: "OrderDetailComponent",

  data() {
    return {
      orderData: null,
      isBusy: false,
      showError: false,
      isChangingData: false,
      backendData: backendData,
      previousOrderData: null,
      promiseQueue: [],
      isProcessingQueue: false,
    };
  },
  props: {
    nextButton: {
      type: String,
      default: "",
    },
  },
  beforeMount() {
    
    bus.$on("row-selected", (orderID) => {
      this.getOrderById(orderID);
      this.showError = false;
    });
    bus.$on("no-order-selected", () => {
      this.orderData = null;
    });
  },
  mounted() {
    bus.$emit("order-data-loaded");
  },
  updated() {
    if (!this.isBusy) bus.$emit("order-data-loaded");
  },
  watch: {
    orderID(newOrderID) {
      this.getOrderById(newOrderID);
    },
    orderData() {
      this.orderData;
    },
  },
  methods: {
    handleOrdenEliminada(){
      this.orderData = null;
    },
    actualizarAccesorio(nuevoValor) {
      this.orderData.accesorio = nuevoValor;
    },

    initiateDataChange(section) {
      this.isChangingData = true;
      const previousOrderData = { ...this.orderData };
      if (this[`timer${section}`]) {
        clearTimeout(this[`timer${section}`]);
      }
      this[`timer${section}`] = setTimeout(() => {
        this.changeOrderData(
          previousOrderData[section],
          section,
          previousOrderData
        );
      }, 2000);
    },

    changeInforme() {
      this.initiateDataChange("informe");
    },

    changePresupuesto() {
      this.initiateDataChange("presupuesto");
    },

    changePrice() {
      this.initiateDataChange("importe");
    },

    toggleBusy() {
      this.isBusy = !this.isBusy;
    },

    changeOrderData(value, section, order) {
      console.log(order);
      const promiseFunction = () => {
        return new Promise((resolve) => {
          const trimmedValue = value.trim();
          if (!trimmedValue || trimmedValue === "") {
            value = null;
            this.isChangingData = false;
          }
          console.log(value )
          const orderId = order.id;
          const newData = {
            [section]: value,
            id_cliente: order.cliente.id,
            id_equipo: order.equipo.id,
          };
          const workerCode = `
          onmessage = function(e) {
            const { backendData, orderId, newData } = e.data;

            fetch(backendData + '/orden/' + orderId, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newData),
            })
              .then(function(response) {
                if (response.ok) {
                  return response.text();
                  this.isChangingData= false;
                } else {
                  throw new Error('Error al actualizar el informe: ' + response.status);
                }
              })
              .then(function() {
                postMessage('changeOrderDataCompleted');
              })
              .catch(function(error) {
                console.error(error);
              });
          }
        `;
          const worker = new Worker(
            URL.createObjectURL(
              new Blob([workerCode], { type: "application/javascript" })
            )
          );
          worker.addEventListener("message", (event) => {
            if (event.data === "changeOrderDataCompleted") {
              this.isChangingData = false;
              worker.terminate();
              resolve();
            }
          });
          worker.postMessage({
            backendData: this.backendData,
            orderId,
            newData,
          });
        });
      };

      this.promiseQueue.push(promiseFunction);
      if (!this.isProcessingQueue) {
        this.processPromiseQueue();
      }
    },

    processPromiseQueue() {
      if (this.promiseQueue.length === 0) {
        this.isProcessingQueue = false;
        return;
      }
      const nextPromise = this.promiseQueue.shift();
      nextPromise()
        .then(() => {
          this.processPromiseQueue();
        })
        .catch((error) => {
          console.error("Error al procesar la promesa:", error);
          this.processPromiseQueue();
        });
    },

    getOrderById(orderId) {
      this.currentOrderId = orderId;
      this.toggleBusy();
      fetch(`${backendData}/orden/${orderId}`)
        .then((response) => response.json())
        .then((order) => {
          this.orderData = order;
          this.toggleBusy();
        })

        .catch((error) => {
          console.error("Error al obtener la orden:", error);
        });
    },

    updateOrderStatus(orderId, endpoint) {
      fetch(`${backendData}/orden/${orderId}/${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("La orden se actualizó correctamente");
            bus.$emit("cambiar-estado");
            this.orderData = null;
          } else {
            console.error("Error al actualizar la orden:", response.status);
          }
        })
        .catch((error) => {
          console.error("Error en la llamada a la API:", error);
        });
    },
    changeStatus(orderId) {
      this.updateOrderStatus(orderId, "estado");
    },
    changeStatusNA(orderId) {
      this.updateOrderStatus(orderId, "presupuestoNA");
    },
    rebudget(orderId) {
      this.updateOrderStatus(orderId, "presupuestarA");
    },

    handleOk(orderId) {
      if (this.orderData.estado === 1 && !this.orderData.informe) {
        this.showError = true;
      } else if (this.orderData.estado === 2) {
        if (!this.orderData.importe || !this.orderData.presupuesto) {
          this.showError = true;
        } else {
          this.changeStatus(orderId);
          this.showError = false;
        }
      } else {
        this.changeStatus(orderId);
        this.showError = false;
      }
    },
  },
};
</script>
<style scoped>
#orderDetailContainer {
  min-height: 520px !important;
}
textarea:focus,
input:focus {
  outline: none;
}
textarea,
input {
  border-radius: 3px;
  border: 1px solid #ccc;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>
