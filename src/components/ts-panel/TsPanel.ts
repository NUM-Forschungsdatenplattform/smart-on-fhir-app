import Vue from 'vue';
import Component from "vue-class-component";

@Component({
    props: {
        myStrProp: {
            type: String
        },
        myIntProp:{
            type:Number
        }
    }
})

export default class HelloWorld extends Vue{
    myData: {name:String} = {name: 'testname'}

    myMethod():boolean{return true;}
}