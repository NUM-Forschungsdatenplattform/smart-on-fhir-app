<template>
  <v-card >
    <v-list>
      <v-subheader>
        Allergies
        <v-spacer></v-spacer>
        <v-btn
            icon
            :disabled="disabled"
            @click="$emit('add-allergy')">
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-subheader>
      <clinical-doc-item-list
          :disabled="disabled"
          v-on:handle-delete="$emit('handle-delete', $event)"
          v-on:clinical-doc-select="$emit('clinical-doc-select', $event)"
          v-on:start-edit-allergy="$emit('start-edit-allergy', $event)"
          v-for="a in allergies"
          :key="a.id"
          :docId = "a.id"
          :document-name="a.name"/>
    </v-list>
  </v-card>
</template>

<script>
import ClinicalDocItemList from '@/components/ClinicalDocItemList';

export default{
  props:['allergies', 'disabled'],
  components:{'clinical-doc-item-list':ClinicalDocItemList}
}
</script>