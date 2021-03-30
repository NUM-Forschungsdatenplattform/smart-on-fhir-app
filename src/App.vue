<template>
  <v-app>
    <v-main>
      <SoftMain :oaToken="oaToken" :oaPatient="oaPatient"/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import SoftMain from './components/SofMain.vue'

export default Vue.extend({
  props: {
    oaToken: String,
    oaPatient: String
  },
  name: 'App',

  components: {
    SoftMain,
  },

  data: () => ({
  }),
});
</script>
