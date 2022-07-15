export function sortByDate(tab) {
    tab.sort((a, b) => {
        const dateA = Date.parse(a.created);
        const dateB = Date.parse(b.created);
        if (dateA > dateB) {
            return -1;
        } 
        if (dateA < dateB) {
            return 1;
        }
        return 0;
    })
}

export function createDate(date, location) {
    return new Date(date).toLocaleDateString(location, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })
}