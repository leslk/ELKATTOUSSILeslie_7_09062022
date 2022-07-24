export async function checkErrorsAndGetData(res) {
    console.log(res.status);
    switch (res.status) {
        case 401 : 
            throw Error("requête non authentifiée");

        case 403 : 
            throw Error("requête non autorisée");

        default :
            if (res.status === 200 || res.status === 201) {
                return await res.json();
            }

            throw Error("une erreur est survenue");
    }
}

// function handleError(status) {
//     switch (status) {
//         case 401 : 
//             alert("requête non authentifiée");
//             return false;

//         case 403 : 
//             alert("requête non autorisée");
//             return false;

//         case 500 : 
//             alert("une erreur est survenue");
//             return false;

//         default : 
//             return true

//     }
// }