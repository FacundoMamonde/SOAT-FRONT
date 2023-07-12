<template>
  <div
    id="divOrderDetail"
    class="card"
    style="min-width: 360px; max-width: 1000px; border-radius: 0% !important"
  >
    <div
      id="orderDetailContainer"
      style="padding-left: 15px"
      v-if="cliente && equipo"
    >
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
              <p v-if="cliente.name" class="m-0 pt-2">{{ cliente.name }}</p>
              <p v-else class="m-0 pt-2">Nombre de Cliente</p>

              <p v-if="cliente.phone" class="mt-0">{{ cliente.phone }}</p>
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
              <p v-if="equipo.marca" class="m-0 pt-2">{{ equipo.marca }}</p>
              <p v-else class="m-0 pt-2">Tipo de Equipo - Marca</p>

              <p v-if="equipo.marca" class="m-0">{{ equipo.modelo }}</p>
              <p v-else class="m-0">Modelo</p>
              <p v-if="equipo.nSerie" class="m-0">{{ equipo.nSerie }}</p>
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
              <p v-if="orderData.accesorio" class="m-0 pt-2">
                {{ orderData.accesorio }}
              </p>
              <p v-else class="m-0 pt-2">Sin Accesorios</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h5 class="mt-3">Descripción de la falla</h5>
        <textarea
          v-model="orderData.falla"
          class="col-11 p-0 m-0"
          style="height: 100px; min-height: 80px; max-height: 120px; width: 95%"
          name=""
          id=""
          cols="30"
          rows="10"
        >
        </textarea>
      </div>
      <div>
        <h5 class="mt-3">Informe</h5>
        <textarea
          v-model="orderData.informe"
          class="col-11 p-0 m-0"
          style="height: 100px; min-height: 80px; max-height: 120px; width: 95%"
          name=""
          id=""
          cols="30"
          rows="10"
          @input="changeInforme"
        ></textarea>
        <div class="d-flex flex-row" style="width: 97%">
          <div class="p-2 w-100">
            <span class="align-middle">$ </span>
            <input
              v-model="orderData.importe"
              type="text"
              style="width: 100px"
              @input="changePrice()"
            />
          </div>
          <div class="p-2 flex-shrink-1">
            <button class="btn btn-primary btn-sm m-0" style="width: 100px">
              <i class="bi bi-printer"></i> Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="w-100 d-flex justify-content-end card-footer">
      <button class="btn btn-success" @click="changeStatus(orderData.id)">
        Finalizar
      </button>
    </div>
  </div>
</template>

<script>
import { bus } from "../main";

export default {
  name: "OrderDetailComponent",
  data() {
    return {
      orderData: null,
      equipo: null,
      cliente: null,
      typingTimer: null,
    };
  },
  beforeMount() {
    bus.$on("row-selected", (orderID, equipoID, clienteID) => {
      this.getOrderById(orderID);
      this.getEquipoById(equipoID);
      this.getClienteById(clienteID);
    });
  },
  methods: {
    changeInforme() {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.changeOrderData(this.orderData.informe, "informe");
      }, 2000);
    },
    changePrice() {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.changeOrderData(this.orderData.importe, "importe");
      }, 2000);
    },

    changeOrderData(value, section) {
      const orderId = this.orderData.id;
      const newData = {
        dato: value,
      };
      fetch(`http://localhost:3000/orden/${orderId}/${section}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: `["${value}"]`,
      })
        .then((response) => {
          console.log(newData);
          if (response.ok) {
            console.log("Informe actualizado correctamente");
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
      fetch(`http://localhost:3000/orden/${orderId}`)
        .then((response) => response.json())
        .then((order) => {
          this.orderData = order;
        })
        .catch((error) => {
          console.error("Error al obtener la orden:", error);
        });
    },
    getEquipoById(equipoId) {
      fetch(`http://localhost:3000/equipo/${equipoId}`)
        .then((response) => response.json())
        .then((equipo) => {
          this.equipo = equipo;
        })
        .catch((error) => {
          console.error("Error al obtener el equipo:", error);
        });
    },
    getClienteById(clienteId) {
      fetch(`http://localhost:3000/cliente/${clienteId}`)
        .then((response) => response.json())
        .then((cliente) => {
          this.cliente = cliente;
        })
        .catch((error) => {
          console.error("Error al obtener el cliente:", error);
        });
    },
    changeStatus(orderId) {
      fetch(`http://localhost:3000/orden/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("La orden se actualizó correctamente");
            bus.$emit('cambiar-estado');
           
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
<style scoped></style>


