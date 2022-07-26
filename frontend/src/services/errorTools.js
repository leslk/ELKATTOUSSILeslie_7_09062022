export async function checkErrorsAndGetData(res, error) {
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