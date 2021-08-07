class localStorageHandler {
    constructor(url) {
        this.url = url;
    }
    set(data) {
        try {
            const dataString = JSON.stringify(data);
            localStorage.setItem(String(this.url), dataString);
            return true;
        } catch(err) {
            return false;
        }
    }
    get() {
        const dataString = localStorage.getItem(String(this.url));
        return JSON.parse(dataString) || []
    }
    remove() {
        localStorage.removeItem(String(this.url))
    }
    getLastId() {
        const data = this.get();
        return data.reduce((acc, curr) => {
            if (curr.children.length > 0) {
                acc = curr.children.reduce((acc, curr) => {
                    return Math.max(acc, curr.id)
                }, acc)
            }
            return Math.max(curr.id, acc)
        }, 0) || 0;
    }
}
export default localStorageHandler;