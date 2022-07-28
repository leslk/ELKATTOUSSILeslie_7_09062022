import { getItem, removeItem } from "./localStorageTools";


export function hasAuthenticated() {
    const user = getItem("user");
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

export function checkToken(token) {
    const user = getItem("user");
    if (user && user.token) {
        if(user.token !== token) {
            return false
        }
        return true;
    }
    return false
}


