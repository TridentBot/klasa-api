const { Piece } = require("klasa");

class Middleware extends Piece {

    constructor(store, file, core, options = {}) {
        super(store, file, core, options);

        this.priority = options.priority;
    }

	async run(request, response, route) { // eslint-disable-line
        // Defined in extension Classes
        throw new Error(`The run method has not been implemented by ${this.type}:${this.name}.`);
    }

}

module.exports = Middleware;
