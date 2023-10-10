<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
body {
  background-color: rgb(32, 32, 32) !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #252628;
  max-width: 1200px;
  margin: auto;
  height: 100vh;
  background-color: #252628;
}

nav {
  padding: 30px;
  text-align: center;
}

nav a {
  font-weight: bold;
  color: #101011;
}

nav a.router-link-exact-active {
  color: #42b983;
}

#divOrderContainer {
  min-width: 360px;
  max-width: 1200px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #ededed;
}

#divOrderDetail,
#divOrderTable {
  min-width: 360px;
  background-color: #ededed;
  flex: 1;
  border: none;
  color: #6a6a6b;
  min-height: 600px;
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