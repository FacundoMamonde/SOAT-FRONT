<template>
  <div>
    <b-button
      @click="modalShow = !modalShow"
      variant="success rounded-pill"
      class="ms-2 fw-bold"
      >+</b-button
    >
    <b-modal v-model="modalShow" title="Nueva Orden">
      <div class="modal-body">
        <!-- Div Cliente -->
        <div class="d-flex flex-row">
          <div class="col-md-1" style="width: 50px">
            <i class="bi bi-person-circle col-md-8" style="font-size: 40px"></i>
            <!-- Icono de Cliente-->
          </div>
          <div class="d-flex flex-column" style="width: 260px">
            <input class="m-0" placeholder="Nombre de cliente" READONLY />
            <input class="mt-0" placeholder="Celular del cliente" READONLY />
          </div>
          <div>
            <button class="btn btn-primary btn-sm">
              <i class="bi bi-search"></i>
            </button>
            <button class="btn btn-success btn-sm">
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>
        <!-- Div Equipo -->
        <div class="d-flex flex-row mt-2">
          <div class="col-md-1" style="width: 50px">
            <i class="bi bi-laptop col-md-8" style="font-size: 40px"></i>
            <!-- Icono de Equipo-->
          </div>
          <div class="d-flex flex-column" style="width: 260px">
            <!-- Seleccion de tipo de Equipo-->
            <form action="#" style="width: 100%">
              <select name="equiposType" id="eType" style="width: 100%">
                <option value="">---Tipo de Equipo---</option>
                <option value="CPU">CPU</option>
                <option value="Notebook">Notebook</option>
                <option value="Celular">Celular</option>
              </select>
            </form>
            <!-- Seleccion de Marca -->
            <form action="#">
              <select name="equiposType" id="eBrand" style="width: 100%">
                <option value="">---Marca del equipo---</option>
                <option value="Acer">Acer</option>
                <option value="HP">HP</option>
                <option value="Lenovo">Lenovo</option>
                <option value="Sony">Sony</option>
              </select>
            </form>
            <!-- Seleccion de Modelo -->
            <form action="#">
              <select name="equiposType" id="eModel" style="width: 100%">
                <option value="">---Modelo equipo---</option>
                <option value="Aspire3">Aspire 3</option>
                <option value="Aspire5">Aspire 5</option>
              </select>
            </form>
          </div>
          <div>
            <button class="btn btn-primary btn-sm">
              <i class="bi bi-search"></i>
            </button>
            <button class="btn btn-success btn-sm">
              <i class="bi bi-plus-lg"></i>
            </button>

            <div>
              <b-dropdown
                id="dropdown-form"
                text="+"
                variant="success"
                dropleft
                ref="dropdown "
              >
                <b-dropdown-form>
                  <b-form-group
                    label="Email"
                    label-for="dropdown-form-email"
                    @submit.stop.prevent
                  >
                    <b-form-input
                      id="dropdown-form-email"
                      size="sm"
                      placeholder="email@example.com"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                    label="Password"
                    label-for="dropdown-form-password"
                  >
                    <b-form-input
                      id="dropdown-form-password"
                      type="password"
                      size="sm"
                      placeholder="Password"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-checkbox class="mb-3">Remember me</b-form-checkbox>
                  <b-button variant="primary" size="sm" @click="onClick"
                    >Sign In</b-button
                  >
                </b-dropdown-form>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item-button
                  >New around here? Sign up</b-dropdown-item-button
                >
                <b-dropdown-item-button
                  >Forgot Password?</b-dropdown-item-button
                >
              </b-dropdown>
            </div>
          </div>
        </div>
        <datalist id="equipoType">
          <option value="">Tipo de Equipo</option>
          <option value="Notebook">Notebook</option>
          <option value="CPU">CPU</option>
          <option value="Celular">Celular</option>
        </datalist>
        <div>
          <h5 class="mt-3">Accesorios</h5>
          <textarea
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
          ></textarea>
        </div>
        <div>
          <h5 class="mt-3">Descripción de la falla</h5>
          <textarea
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
          ></textarea>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "NewOrderComponent",
  data() {
    return {
      modalShow: false,
    };
  },
};
</script>
<style scoped></style>
