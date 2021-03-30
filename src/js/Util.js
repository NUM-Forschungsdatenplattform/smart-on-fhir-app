// import axios from "axios";

export class DataStore{
    numval;
    strval;
}

// export function postAllergy(allergy){
//     let  lst = [];
//     axios
//         .post("http://localhost:8081/allergies", allergy)
//         .then(function(response){
//             let algNew = response.data;
//             lst.push(algNew);
//             console.log(lst.length);
//             console.log(lst[0]);
//         }).then(data => lst.push(data));
//     return lst[0];
// }