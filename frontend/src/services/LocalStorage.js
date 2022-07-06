export function addItem(itemKeyName, newItem) {
    localStorage.setItem(itemKeyName, newItem);
    //console.log(itemKeyName, newItem);
}

export function getItem(item) {
    return localStorage.getItem(item);
}

export function removeItem(itemToRemove) {
    localStorage.removeItem(itemToRemove);
}