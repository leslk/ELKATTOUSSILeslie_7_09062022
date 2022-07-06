import { getItem, removeItem } from "./LocalStorage";

export function hasAuthenticated() {
    const token = getItem("token");
    if (token) {
        if (tokenIsValid(token)) {
            return true;
        }
        removeItem('token'); 
    }
    return false;
}

export function tokenIsValid(token) {
    const exp = JSON.parse(atob(token.split(".")[1])).exp;
    return exp * 1000 > new Date().getTime();
}

export function logout() {
    console.log(localStorage.getItem("token"));
    removeItem("token");
}


