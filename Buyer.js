class Buyer {
    constructor(market) {
        this.market = market;
    }
    

    /**
     * This method should get the best price for a given product 
     * across all sellers
     */
    getBestPrice(product) {
        throw Error("Not Implemented");
    }


    /**
     * This method should optimise price when filling an order
     * if the quantity is greater than any single seller can accomodate
     * then the next cheapest seller should be used.
     */
    fillWithBestPrices(product, quantity) {
        throw Error("Not Implemented");
    }


    /**
     * This method should optimise for sellers with the largest inventory when filling an order
     * if the quantity is greater than any single seller can accomodate
     * then the next largest seller should be used.
     * if multiple sellers have the same amount of inventory
     * you should use the cheaper of the two.
     */
    fillWithLargestSellers(product, quantity) {
        throw Error("Not Implemented");
    }
}

module.exports = {Buyer}
