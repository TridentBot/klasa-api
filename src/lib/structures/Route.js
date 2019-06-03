const { Piece } = require("klasa");

const { parse } = require("../util/Util");

class Route extends Piece {

    constructor(client, store, file, core, options = {}) {
        super(client, store, file, core, options);

        this.route = this.client.options.api.prefix + options.route;

        this.authenticated = options.authenticated;

        this.parsed = parse(this.route);
    }

    matches(split) {
        if (split.length !== this.parsed.length) return false;
        for (let i = 0; i < this.parsed.length; i++) if (this.parsed[i].type === 0 && this.parsed[i].val !== split[i]) return false;
        return true;
    }

    execute(split) {
        const params = {};
        for (let i = 0; i < this.parsed.length; i++) if (this.parsed[i].type === 1) params[this.parsed[i].val] = split[i];
        return params;
    }

}

module.exports = Route;
