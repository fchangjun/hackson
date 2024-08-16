
export class Cache {
    constructor() {
        this.cache = {};
    }

    set(key, value) {
        this.cache[key] = value;
    }
    
    get(key) {
        return this.cache[key];
    }
}

export default new Cache();