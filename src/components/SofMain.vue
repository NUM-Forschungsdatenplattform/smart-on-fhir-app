<template>
<!--  see re fill-height: https://stackoverflow.com/questions/59840960/how-can-i-make-my-v-container-fill-all-height-available-->
  <v-container v-on:handle-delete="handleDelete" style="min-width: 900px">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>Patient demographic</v-card-title>
          <v-card-text>
            Name: {{patientInfo.givenName}} {{patientInfo.familyName}}<br>
            FHIR Resource id: {{patientInfo.id}}<br>
            Ehr id: {{patientInfo.identifier.value}}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">

      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5">
        <condition-list
            :disabled="!conditionListEnabled"
            v-bind:conditions="this.conditions"
            v-on:ev-fhir-resource-delete="handleDelete"
            v-on:ev-fhir-resource-select="handleConditionSelect"
            v-on:add-condition="displayAddNewCondition"
            v-on:ev-fhir-resource-edit="startEditCondition"
            class="mb-4"
        />
      </v-col>
      <v-col cols="7">
        <key-val-card v-if="selectedCondition >= 0" :key-values="conditionKeyValueList"/>
        <condition-editor
            v-if="conditionEditorState.visible"
            v-on:new-condition="addConditionToConditions"
            v-on:cancel-new-condition="cancelNewCondition"
            v-on:update-condition="updateConditionInConditionList"
            v-on:cancel-edit-condition="cancelEditCondition"
            :mode="conditionEditorState.mode"
            :allergyId="conditionEditorState.allergyId"
            :name="conditionEditorState.allergyData.name"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./SoftMain.js"/>
