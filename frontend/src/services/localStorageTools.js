export function addItem(itemKeyName, newItem) {
    localStorage.setItem(itemKeyName, newItem);
}

export function getItem(item) {
    return JSON.parse(localStorage.getItem(item));
}

export function removeItem(itemToRemove) {
    localStorage.removeItem(itemToRemove);
}