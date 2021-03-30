//that @ is from vue-cli, it is an alias for path to src dir
//see webpack.config.js under dev4
//https://stackoverflow.com/questions/42749973/es6-import-using-at-sign-in-path-in-a-vue-js-project-using-webpack
import {DataStore} from "@/js/Util";
import AllergyList from "@/components/AllergyList"
import KeyValueCard from "@/components/KeyValueCard"
import AllergyEditor from "@/components/AllergyEditor"
import TsPanel from "@/components/ts-panel/TsPanel.vue"//must use .vue or it'll attempt to import js file
import axios from "axios";
import ConditionList from "@/components/ConditionList";
import ConditionEditor from "@/components/ConditionEditor";
import ConditionTemplate from "@/components/ConditionTemplate"

export default {
    name: 'SofMain',
    props: ['tstprop','oaToken', 'oaPatient'],
    data: function() {
        return {
            allergyEditorState: {
                visible:false,
                mode:'new',
                allergyId: -1,
                allergyData: {
                    name: '',
                    substance: '',
                    manifest: ''
                }},
            conditionEditorState: {
                visible:false,
                mode:'new',
                allergyId: -1,
                allergyData: {
                    name: '',
                    substance: '',
                    manifest: ''
                }},
            allergyListEnabled:true,
            conditionListEnabled:true,
            selectedAllergy: -1,
            selectedCondition: -1,
            allergies: [],
            conditions: [],
            patientInfo:{id: '', givenName: '', familyName: '', identifier: {}}
        }
    },
    components: {
        'allergy-list': AllergyList,
        'condition-list': ConditionList,
        'key-val-card': KeyValueCard,
        'allergy-editor': AllergyEditor,
        'condition-editor': ConditionEditor,
        'ts-panel': TsPanel
    },
    computed:{
        conditionTemplate: function(){
            return JSON.parse(ConditionTemplate);
        },
        allergyKeyValueList: function (){//project selected allergy to key-value set
            let nvp = function(n,v){return {name:n,value:v}};
            if(this.selectedAllergy >= 0){
                return [
                    nvp('Name',this.allergies[this.selectedAllergy].name),
                    // nvp('Date of onset', '6/5/2002'),
                    // nvp('Substance', 'Nuts'),
                    // nvp('Reaction', 'Rash, difficulty in breathing')
                ];
            }
            else return [];
        },
        conditionKeyValueList: function (){//project selected allergy to key-value set
            let nvp = function(n,v){return {name:n,value:v}};
            if(this.selectedCondition >= 0){
                return [
                    nvp('Description',this.conditions[this.selectedCondition].name),
                ];
            }
            else return [];
        }
    },
    methods: {
        disableAllergyList(){
            this.selectedAllergy = -1;
            this.allergyListEnabled = false;
        },
        disableConditionList(){
            this.selectedCondition = -1;
            this.conditionListEnabled = false;
        },
        displayAddNewAllergy(){
            this.disableAllergyList();
            this.allergyEditorState.mode = 'new';
            this.allergyEditorState.allergyId = this.allergies.length + 1;
            this.allergyEditorState.visible = true;
        }
        ,displayAddNewCondition(){
            this.disableConditionList();
            this.conditionEditorState.mode = 'new';
            this.conditionEditorState.allergyId = this.allergies.length + 1;
            this.conditionEditorState.visible = true;
        },
        startEditAllergy(docId){
            let idx = this.findAllergyIndex(docId);
            let alg = this.allergies[idx];

            this.disableAllergyList();

            this.allergyEditorState.mode = 'update';
            this.allergyEditorState.allergyId = alg.id;
            this.allergyEditorState.allergyData.name = alg.name;
            this.allergyEditorState.visible = true;
        },
        startEditCondition(docId){
            let idx = this.findConditionIndex(docId);
            let alg = this.conditions[idx];

            this.disableConditionList();

            this.conditionEditorState.mode = 'update';
            this.conditionEditorState.allergyId = alg.id;
            this.conditionEditorState.allergyData.name = alg.name;
            this.conditionEditorState.visible = true;
        },
        cancelNewAllergy(){
            this.resetAllergyEditorState();
            this.allergyListEnabled = true;
        },
        cancelNewCondition(){
            this.resetConditionEditorState();
            this.conditionListEnabled = true;
        },
        cancelEditAllergy(){
            this.selectedAllergy = this.findAllergyIndex(this.allergyEditorState.allergyId);
            this.resetAllergyEditorState();
            this.allergyListEnabled = true;
        },
        cancelEditCondition(){
            this.selectedCondition = this.findConditionIndex(this.conditionEditorState.allergyId);
            this.resetConditionEditorState();
            this.conditionListEnabled = true;
        },
        addConditionToConditions(condition){
            let handler = this.addActualCondition;
            let template = this.conditionTemplate;
            template.code.text = condition.name;
            template.subject.reference = "http://localhost:8082/fhir/Patient/" + this.oaPatient;
            template.subject.identifier.value = this.patientInfo.identifier.value;
            axios
                .post("http://localhost:8888/fhir-bridge/fhir/Condition",
                    template,
                    {'headers':{'Authorization':'Bearer ' + this.oaToken}})
                .then(function(response){
                    let resultResource = response.data;
                    handler({id:resultResource.id, name: resultResource.code.text})});
                // .then(function(response){
                //     console.log("CREATE RESOURCE RESPONSE: " + response)});
        },
        addAllergyToAllergies(allergy){
            // let handler = this.addActualAllergy;
            axios
                .post("http://localhost:8081/allergies" + this.oaPatient,
                    {name: allergy.name},
                    {'headers':{'Authorization':'Bearer ' + this.oaToken}})
                // .then(function(response){handler(response.data)});
                .then(function(response){
                    console.log("CREATE RESOURCE RESPONSE: " + response)});
        },
        addActualAllergy(savedAlg){
            this.allergies.push({id:savedAlg.id, name: savedAlg.name});

            this.allergyListEnabled = true;
            this.resetAllergyEditorState();
            //select newly added allergy
            let idx = this.findAllergyIndex(savedAlg.id);
            this.selectedAllergy = idx;
        },
        addActualCondition(savedCondition){
            this.conditions.push({id:savedCondition.id, name: savedCondition.name});

            this.conditionListEnabled = true;
            this.resetConditionEditorState();
            //select newly added allergy
            let idx = this.findConditionIndex(savedCondition.id);
            this.selectedCondition = idx;
        },
        updateAllergyInAllergyList(allergy){
            let idx = this.findAllergyIndex(this.allergyEditorState.allergyId);//TODO: why don't I have the id in allergy obj?
            let alg = this.allergies[idx];
            let handle = function(response){
                alg.name = response.data.name;
                this.allergyListEnabled = true;
                this.resetAllergyEditorState();
                this.selectedAllergy = idx;
            }.bind(this);
            axios
                .put("http://localhost:8081/allergies/" + alg.id, {name:allergy.name})
                .then(handle)
        },
        updateConditionInConditionList(condition){
            let idx = this.findConditionIndex(this.conditionEditorState.allergyId);//TODO: why don't I have the id in allergy obj?
            let alg = this.conditions[idx];
            let handle = function(response){
                alg.name = response.data.name;
                this.conditionListEnabled = true;
                this.resetConditionEditorState();
                this.selectedCondition = idx;
            }.bind(this);
            axios
                .put("http://localhost:8081/allergies/" + alg.id, {name:condition.name})
                .then(handle)
        },
        handleClinicalDocSelect(id){
            let idx = this.findAllergyIndex(id);
            this.selectedAllergy = idx;
        },
        handleConditionSelect(id){
            let idx = this.findConditionIndex(id);
            this.selectedCondition = idx;
        },
        handleDelete(id){
            let idx = this.findAllergyIndex(id);
            let currAlgId =
                this.selectedAllergy >= 0
                    ?  this.allergies[this.selectedAllergy].id
                    : -1;
            if (idx === this.selectedAllergy){
                this.selectedAllergy = -1;//deleted the allergy on display
            }
            let handle = function(){
                //TODO: this is for updating arr element in place w/o modifying arr
                //let newVal = 'Allergy 1' + this.allergies[0].name;
                //this.$set(this.allergies,0, {id:1, name: newVal});
                this.$set(this.allergies, this.allergies.splice(idx, 1));

                //selected alg may not be valid, array changed,
                // selectedAllergy will point at wrong index if we deleted item < selected index
                if(this.selectedAllergy !== -1){//didn't delete selected one, let's update index
                    this.selectedAllergy = this.findAllergyIndex(currAlgId);
                }
            }.bind(this);
            axios
                .delete("http://localhost:8081/allergies/" + id)
                .then(function(response){
                    if(response.status === 200){
                        handle()
                    }});
        },
        findAllergyIndex(id){
            return this.allergies.findIndex(function(alg){return alg.id === id});
        },
        findConditionIndex(id){
            return this.conditions.findIndex(function(cond){return cond.id === id});
        },
        tst(){
            const  ds = new DataStore();
            ds.numval = 2;
            ds. strval = "some string val from Data store";
            return ds.strval;
        },
        getPatientResource(){
            axios
                .get(
                    "http://localhost:8082/fhir/Patient/" + this.oaPatient,
                    {'headers':{'Authorization':'Bearer ' + this.oaToken}})
                .then(function(response){
                    let patient = response.data;

                    this.patientInfo = {
                        id: patient.id,
                        //TODO: assuming array fields such as patient.identifier has only one element
                        identifier: patient.identifier[0],
                        givenName:
                            (patient.name[0] != null && patient.name[0].given != null)
                                ? patient.name[0].given.join(' ')
                                : "",
                        familyName:
                            (patient.name[0] != null && patient.name[0].family != null)
                                ? patient.name[0].family
                                : ""
                    }
                }.bind(this));
        },
        getAllergies(){
            let allergies = this.allergies;
            axios
                .get("http://localhost:8081/allergies")
                .then(function(response){
                    let algs = response.data;
                    if (algs.length > 0) {
                        algs.forEach(function(alg){allergies.push({id:alg.id, name:alg.name})} );
                    }
                })
                .catch(function (err) { //TODO: https://stackoverflow.com/questions/47067929/how-to-handle-neterr-connection-refused-in-axios-vue-js
                    //you cannot stop errors going to the console
                    //https://stackoverflow.com/questions/51978983/how-to-remove-the-console-errors-in-axios
                    //https://stackoverflow.com/questions/16372271/jquery-ajax-how-to-prevent-404-errors-spam-in-chrome-devtools/16379746#16379746
                    if(!err.response){
                        console.log('network error occured')
                    }else
                        console.log(err);
                });
        },
        getConditions(){
            let conditions = this.conditions;
            axios
                .get(
                    "http://localhost:8888/fhir-bridge/fhir/Condition?subject=http://localhost:8082/fhir/Patient/" + this.oaPatient + "&_count=100",
                    {'headers':{'Authorization':'Bearer ' + this.oaToken}})
                .then(function(response){
                    let conditionBundle = response.data;
                    if (conditionBundle.entry.length > 0) {
                        conditionBundle
                            .entry
                            .forEach(function(cond){
                                conditions.push({id:cond.resource.id, name:cond.resource.code.text})
                            } );
                    }
                }.bind(this));
        },
        resetConditionEditorState(){
            this.conditionEditorState.visible = false;
            this.conditionEditorState.allergyId = -1;
            this.conditionEditorState.allergyData.id = -1;//TODO: can I get away with null'ing allergyData?
            this.conditionEditorState.allergyData.name = '';
            this.conditionEditorState.allergyData.substance = '';
            this.conditionEditorState.allergyData.manifest = '';
        },
        resetAllergyEditorState(){
            this.allergyEditorState.visible = false;
            this.allergyEditorState.allergyId = -1;
            this.allergyEditorState.allergyData.id = -1;//TODO: can I get away with null'ing allergyData?
            this.allergyEditorState.allergyData.name = '';
            this.allergyEditorState.allergyData.substance = '';
            this.allergyEditorState.allergyData.manifest = '';
        }
    },
    mounted() {
        //better wait for next tick before making this call
        //see https://vuejs.org/v2/api/#mounted
        this.$nextTick(function () {
            this.getPatientResource();
            this.getConditions();
        })


        // let allergies = this.allergies;
        // axios
        //     .get("http://localhost:8081/allergies")
        //     .then(function(response){
        //         let algs = response.data;
        //         if (algs.length > 0) {
        //             algs.forEach(function(alg){allergies.push({id:alg.id, name:alg.name})} );
        //         }
        //     })
        //     .catch(function (err) { //TODO: https://stackoverflow.com/questions/47067929/how-to-handle-neterr-connection-refused-in-axios-vue-js
        //         //you cannot stop errors going to the console
        //         //https://stackoverflow.com/questions/51978983/how-to-remove-the-console-errors-in-axios
        //         //https://stackoverflow.com/questions/16372271/jquery-ajax-how-to-prevent-404-errors-spam-in-chrome-devtools/16379746#16379746
        //         if(!err.response){
        //             console.log('network error occured')
        //         }else
        //             console.log(err);
        //     });
    }
}