<template>
  <v-card>
    <v-card-text>
      <v-form>
<!--        v-model needed (two way), not v-bind (one way) see https://stackoverflow.com/questions/42260233/vue-js-difference-between-v-model-and-v-bind-->
        <v-text-field label="Name" required v-model="allergyInfo.name"/>
        <v-text-field label="Substance" required v-model="allergyInfo.substance"/>
        <v-text-field label="Manifestation" v-model="allergyInfo.manifestation"/>
        <v-btn v-if="mode === 'new' || mode === 'update'"
               type="submit"
               @click.prevent="$emit(mode === 'new' ? 'new-allergy' : 'update-allergy', allergyInfo)"
                >{{mode === 'new' ? 'CREATE' : 'UPDATE' }}</v-btn>
        <v-btn v-if="mode === 'new' || mode === 'update'"
               class="ml-4"
               type="submit"
              @click.prevent="$emit(mode === 'new' ? 'cancel-new-allergy' : 'cancel-edit-allergy')"
              >CANCEL</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: ['mode','allergyId','name', 'substance', 'manifestation'],
  data:function(){
    return {
      //create a new object based on copies of primitives based on props
      //since name, substance etc are all primitives/immutable(string)
      //binding UI elements to local data will keep props read-only
      //see https://vuejs.org/v2/guide/components-props.html#One-Way-Data-Flow
      allergyInfo: {
        id: this.allergyId,
        name: this.name,
        substance: this.substance,
        manifestation: this.manifestation
      }
    }
  }
}
</script>