<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-list dense flat>
          <v-subheader>Patient Data</v-subheader>
          <v-list-item-group color="primary">
            <v-row>
              <v-col cols="8">
                <v-list-item key="1">
                  <v-list-item-icon>
                    <v-icon v-text="'mdi-account'"/>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Allergies</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="4">
                <v-btn icon>
                  <v-icon>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-list-item key="2">
              <v-list-item-icon>
                <v-icon v-text="'mdi-account'"/>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Medications</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
const patientDataNavigator = Vue.component('patient-data-navigator', {});
export default patientDataNavigator;
</script>