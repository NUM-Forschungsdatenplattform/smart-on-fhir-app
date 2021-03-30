<template>
  <v-card >
    <v-list>
      <v-subheader>
        Conditions
        <v-spacer></v-spacer>
        <v-btn
            icon
            :disabled="disabled"
            @click="$emit('add-condition')">
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-subheader>
      <fhir-resource-list-item
          :disabled="disabled"
          v-on:ev-fhir-resource-delete="$emit('ev-fhir-resource-delete', $event)"
          v-on:ev-fhir-resource-select="$emit('ev-fhir-resource-select', $event)"
          v-on:ev-fhir-resource-edit="$emit('ev-fhir-resource-edit', $event)"
          v-for="a in conditions"
          :key="a.id"
          :docId = "a.id"
          :document-name="a.name"/>
    </v-list>
  </v-card>
</template>

<script>
import FhirResourceListItem from "@/components/FhirResourceListItem";

export default{
  props:['conditions', 'disabled'],
  components:{'fhir-resource-list-item':FhirResourceListItem}
}
</script>