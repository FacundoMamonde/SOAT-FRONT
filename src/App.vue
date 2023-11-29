<template>
  <div id="app" class="container-fluid-lg">
    <router-view />
  </div>
</template>

<style>
body {
  background-color: rgb(32, 32, 32) !important;
  max-width: 100vw;
  height: 100vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #252628;

  margin: auto;
  max-width: 100vw;
  height: 100vh;

  background-color: #252628;
}

#divOrderContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #ededed;
}

#divOrderDetail,
#divOrderTable {
  background-color: #ededed;

  border: none;
  color: #494949;
}
#divOrderTable {
  background-color: #f3f3f3;
}
p {
  font-size: 14px;
}
.row {
  --bs-gutter-x: 0 !important;
  --bs-gutter-y: 0;
  margin-top: 0px !important;
  margin-right: 0 !important;
  margin-left: 0 !important;
}
</style>
