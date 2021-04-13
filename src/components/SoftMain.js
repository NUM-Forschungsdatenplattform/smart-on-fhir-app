//that @ is from vue-cli, it is an alias for path to src dir
//see webpack.config.js under dev4
//https://stackoverflow.com/questions/42749973/es6-import-using-at-sign-in-path-in-a-vue-js-project-using-webpack
import {DataStore} from "@/js/Util";
import KeyValueCard from "@/components/KeyValueCard"
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
            conditionEditorState: {
                visible:false,
                mode:'new',
                allergyId: -1,
                allergyData: {
                    name: '',
                    substance: '',
                    manifest: ''
                }},
            conditionListEnabled:true,
            selectedCondition: -1,
            conditions: [],
            patientInfo:{id: '', givenName: '', familyName: '', identifier: {}}
        }
    },
    components: {
        'condition-list': ConditionList,
        'key-val-card': KeyValueCard,
        'condition-editor': ConditionEditor,
        'ts-panel': TsPanel
    },
    computed:{
        conditionTemplate: function(){
            return JSON.parse(ConditionTemplate);
        },
        conditionKeyValueList: function (){//project selected condition to key-value set
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
        disableConditionList(){
            this.selectedCondition = -1;
            this.conditionListEnabled = false;
        }
        ,displayAddNewCondition(){
            this.disableConditionList();
            this.conditionEditorState.mode = 'new';
            this.conditionEditorState.allergyId = this.allergies.length + 1;
            this.conditionEditorState.visible = true;
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
        cancelNewCondition(){
            this.resetConditionEditorState();
            this.conditionListEnabled = true;
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
        addActualCondition(savedCondition){
            this.conditions.push({id:savedCondition.id, name: savedCondition.name});

            this.conditionListEnabled = true;
            this.resetConditionEditorState();
            //select newly added allergy
            let idx = this.findConditionIndex(savedCondition.id);
            this.selectedCondition = idx;
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
        handleConditionSelect(id){
            let idx = this.findConditionIndex(id);
            this.selectedCondition = idx;
        },
        handleDelete(id){
            //TODO:IMPLEMENT
            console.log(id);
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
                    if (conditionBundle.total > 0) {
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
        }
    },
    mounted() {
        //better wait for next tick before making this call
        //see https://vuejs.org/v2/api/#mounted
        this.$nextTick(function () {
            this.getPatientResource();
            this.getConditions();
        })
    }
}