class Buyer {
    constructor(market) {
        this.market = market;
    }
    getBestPrice(product) {
        throw Error("Not Implemented");
    }
    completelyFill(product, quantity) {
        throw Error("Not Implemented");
    }
    quicklyFill(product, quantity) {
        throw Error("Not Implemented");
    }
}

module.exports = {Buyer}
