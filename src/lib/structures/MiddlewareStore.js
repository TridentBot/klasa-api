const { Store } = require("klasa");

const Middleware = require("./Middleware");

class MiddlewareStore extends Store {

    constructor(client) {
        super(client, "middlewares", Middleware);

        this.sortedMiddlwares = [];
    }

    clear() {
        this.sortedMiddlwares = [];
        return super.clear();
    }

    set(piece) {
        const middleware = super.set(piece);
        if (!middleware) return middleware;
        const index = this.sortedMiddlwares.findIndex(mid => mid.priority >= middleware.priority);
        this.sortedMiddlwares.splice(index === -1 ? 0 : index, 0, middleware);
        return middleware;
    }

    delete(name) {
        const middleware = this.resolve(name);
        if (!middleware) return false;
        this.sortedMiddlwares.splice(this.sortedMiddlwares.indexOf(middleware), 1);
        return super.delete(middleware);
    }

    async run(request, response, route) {
        for (const middleware of this.sortedMiddlwares) {
            if (response.finished) return;
            if (middleware.enabled) await middleware.run(request, response, route);
        }
    }

}

module.exports = MiddlewareStore;
