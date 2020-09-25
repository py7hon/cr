<template>
  <main id="app">
    <navbar />
    <div class="alert alert-primary alert-dismissible fade show" role="alert">
      If Player Error and Get <b>232011</b>, You Must Refresh Page, Because have a problem CORS
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div class="container" v-if="!$route.meta.disableContainer">
      <router-view />
    </div>
    <router-view v-else />

    <app-footer />
  </main>
</template>

<script>
import Navbar from 'modules/navbar/Navbar'
import AppFooter from 'modules/footer/Footer'

export default {
  name: 'app',
  components: {
    Navbar,
    AppFooter
  },
  beforeCreate () {
    this.$store.commit('locale/setLocale', window.localStorage.getItem('locale') || 'enUS')
  }
}
</script>

<style lang="scss">
  html, body, #app {
    height: 100%;
  }

  #app {
    display: flex;
    flex-direction: column;
  }
</style>
