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
}
export default localStorageHandler;