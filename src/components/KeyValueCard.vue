<template>
  <v-card>
    <v-card-text>
      <v-container fluid>
        <v-row v-for="(kv,index) in keyValues" :key="'kv' + index">
          <v-col cols="3" :key="'name' + index">{{kv.name}}</v-col>
          <v-col cols="9" :key="'val' + index">{{kv.value}}</v-col>
        </v-row>
      </v-container>

    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props:['keyValues']
}
</script>