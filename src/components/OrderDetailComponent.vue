<template>
  <div id="divOrderDetail" class="card h-100">
    <div
      v-if="isBusy"
      class="text-center h-100 d-flex align-items-center justify-content-center"
    >
      <b-spinner variant="primary"></b-spinner>
    </div>
    <div v-else class="h-100">
      <div
        v-if="orderData != null"
        class="d-flex flex-column justify-content-between h-100"
      >
        <div id="orderDetailContainer" class="ps-5 flex-grow-1">
          <div>
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
                <div class="d-flex flex-row align-items-center">
                  <!-- Icono de Cliente-->
                  <b-icon icon="person-circle" font-scale="3"></b-icon>

                  <!-- </div> -->
                  <div class="d-flex flex-column ms-3">
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
                <div class="d-flex flex-row align-items-center">
                  <b-icon icon="laptop" font-scale="3"></b-icon>
                  <div class="d-flex flex-column ms-3">
                    <p v-if="orderData.equipo.modelo.marca" class="m-0 pt-2">
                      {{ orderData.equipo.modelo.marca.nombre }}
                    </p>
                    <p v-else class="m-0 pt-2">Tipo de Equipo - Marca</p>
                    <p v-if="orderData.equipo.modelo" class="m-0">
                      {{ orderData.equipo.modelo.nombre }}
                    </p>
                    <p v-else class="m-0 pt-2">Modelo</p>
                    <p v-if="orderData.equipo.n_serie" class="m-0">
                      {{ orderData.equipo.n_serie }}
                    </p>
                    <p v-else class="m-0">n de serie</p>
                  </div>
                </div>
              </div>
              <div class="col-6 d-flex flex-row align-items-center">
                <!-- DIV ACCESORIOS -->
                <div class="d-flex flex-row align-items-center">
                  <!-- Icono de Accesorios-->
                  <b-icon icon="clipboard-check" font-scale="3"></b-icon>

                  <div>
                    <div class="d-flex ms-3">
                      <p v-if="orderData.accesorio" class="m-0">
                        {{ orderData.accesorio }}
                      </p>
                      <p v-else class="m-0">Sin Accesorios</p>
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
          </div>
          <div>
            <div v-if="orderData.estado < 2">
              <h5 class="mt-3">Descripción de la falla</h5>
              <textarea
                disabled
                v-model="orderData.falla"
                class="col-11 p-0 m-0"
                rows="6"
              >
              </textarea>
            </div>
            <div v-if="orderData.estado != 0">
              <h5 class="mt-3">Diagnóstico</h5>
              <textarea
                v-model="orderData.informe"
                class="col-11 p-0 m-0"
                rows="6"
                :class="{
                  'border-danger': !this.orderData.informe && showError,
                }"
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
                  rows="6"
                  @input="changePresupuesto"
                ></textarea>
              </div>

              <div
                v-if="orderData.estado >= 2"
                class="d-flex flex-row justify-content-between col-11"
              >
                <div class="p-2">
                  <span class="align-middle">$ </span>
                  <input
                    id="price"
                    :disabled="orderData.estado > 2"
                    :class="{
                      'border-danger': !this.orderData.importe && showError,
                    }"
                    v-model="orderData.importe"
                    type="number"
                    @input="changePrice()"
                  />
                </div>

                <!-- <h5 v-if="orderData.estado == 4 && !orderData.presupuestoAprobado" class="m-auto text-danger">NO APROBADO</h5> -->
                <div class="p-2 flex-shrink-1">
                  <PDFGenerator :orderData="orderData" />
                </div>
              </div>
              <b-alert
                show
                variant="warning"
                class="text-center col-11"
                v-if="orderData.estado == 4 && !orderData.presupuestoAprobado && !orderData.sinReparacion"
              >
                No aprobado
              </b-alert>

              <b-alert
                show
                variant="danger"
                class="text-center col-11"
                v-if="orderData.sinReparacion"
              >
                Sin Reparacion
              </b-alert>
            </div>
          </div>
        </div>
        <div
          class="w-100 d-flex justify-content-between card-footer mb-3 ps-5 col-3"
        >
          <div class="d-flex">
            <TrackingDates :orden="this.orderData" class="me-3" />

            <DeleteOrder
              :orden="this.orderData"
              @orden-eliminada="handleOrdenEliminada"
            />

            <button 
              :disabled="this.isChangingData"
              v-if="orderData.estado == 1"
              class="btn btn-warning ms-3"
              @click="sinReparacion(orderData.id)"
            >
              Sin reparación
            </button>
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
              @click="handleOk(orderData.id, false)"
            >
              No aprobado
            </button>
            <button
              :disabled="this.isChangingData"
              v-if="orderData.estado < 5"
              class="btn btn-success"
              @click="handleOk(orderData.id)"
            >
              {{ nextButton }}
            </button>
            <button
              :disabled="this.isChangingData"
              v-if="orderData.estado == 6"
              class="btn btn-success"
              @click="restore(orderData.id)"
            >
              Restaurar
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
import TrackingDates from "@/components/TrackingComponent.vue";
import ChangeAccesories from "@/components/ChangeAccesories.vue";
import DeleteOrder from "@/components/DeleteOrder.vue";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  components: {
    PDFGenerator,
    ChangeAccesories,
    TrackingDates,
    DeleteOrder,
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
    handleOrdenEliminada() {
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
      const promiseFunction = () => {
        return new Promise((resolve) => {
          const trimmedValue = value.trim();
          if (!trimmedValue || trimmedValue === "") {
            value = null;
            this.isChangingData = false;
          }
          if (section == "importe") value = Number(value);
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
          Authorization: `Bearer ${localStorage.token}`,
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
    sinReparacion(orderId) {
      this.updateOrderStatus(orderId, "sinReparacion");
    },
    restore(orderId) {
      this.updateOrderStatus(orderId, "restore");
    },

    handleOk(orderId, presupuesto) {
      if (this.orderData.estado === 1 && !this.orderData.informe) {
        this.showError = true;
      } else if (this.orderData.estado === 2) {
        if (!this.orderData.importe || !this.orderData.presupuesto) {
          this.showError = true;
        } else {
          if (presupuesto == false) {
            this.changeStatusNA(orderId);
            this.showError = false;
          } else {
            this.changeStatus(orderId);
            this.showError = false;
          }
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
#divOrderDetail {
  border-radius: 0;
  max-height: 100%;
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
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
#price {
  width: 100px;
}
</style>
