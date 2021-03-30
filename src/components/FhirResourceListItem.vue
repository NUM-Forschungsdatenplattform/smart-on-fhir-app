<template>
  <v-list-item key="alg1">
    <!--        TODO: hacky: https://stackoverflow.com/questions/32445707/is-there-any-way-to-change-the-caption-of-buttons-from-capital-letters-to-small-->
    <!--        also see: https://stackoverflow.com/questions/61654548/how-to-make-2-buttons-with-different-text-lenght-having-same-width-in-vuetify-->

    <!--        use computed enabled property to apply :disabled value of v-list-item
    to all individual components in the list item -->
    <v-btn
        text
        :disabled="disabled"
        style="width:250px;text-transform:unset !important;"
        @click="$emit('ev-fhir-resource-select',docId)">
      <!--          parent and child widths should match: 150px etc-->
      <span class="text-truncate" style="width:250px; text-align: left">{{documentName}}</span>
    </v-btn>
    <v-spacer></v-spacer> <!-- we need icons on the right-->
    <v-btn icon
           :disabled="true"
           v-on:click.stop.prevent="$emit('ev-fhir-resource-edit', docId)">
      <v-icon>mdi-pen</v-icon>
    </v-btn>
    <v-btn icon
           :disabled="true"
           v-on:click.stop.prevent="$emit('ev-fhir-resource-delete', docId)">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </v-list-item>
</template>

<script>
export default{
  props:[
      'docId',
      'documentName',
      'disabled'],//apparently v-list-item does not have disabled prop by default
  methods:{

  }
}
</script>