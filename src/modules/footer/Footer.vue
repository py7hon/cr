<template>
  <footer id="footer">
    <div class="container">
      <div class="row">
        <footer-item>:)</footer-item>
      </div>
    </div>
  </footer>
</template>

<script>
import FooterItem from './FooterItem'

export default {
  name: 'app-footer',
  components: {
    FooterItem
  }
}
</script>

<style lang="scss" scoped>
  @import 'scss/_variables';

  #footer {
    padding: 2em 0;
    background: $dark;
    text-align: center;
    margin-top: auto;
    box-shadow: inset 0px 1px 4px black;
  }
</style>
