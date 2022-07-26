import { getItem, removeItem } from "./localStorageTools";

export function hasAuthenticated() {
    console.log("has authenticated function");
    const user = getItem("user");
    console.log(user);
    if (user && user.token) {
        if (tokenIsValid(user.token)) {
            return user;
        }
        removeItem('user'); 
    }
    return null;
}

export function tokenIsValid(token) {
    const exp = JSON.parse(atob(token.split(".")[1])).exp;
    return exp * 1000 > new Date().getTime();
}

export function logout() {
    removeItem("user");
}


