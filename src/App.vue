<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Login</router-link> |
      <router-link to="/sprint">Current Sprint</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import './assets/kanban.scss';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.card-title {
  padding-right: 20px;
}
</style>
