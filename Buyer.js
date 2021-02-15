const { multiKeySort } = require('./utilities');

const checkMarketQuantity = (sellersInventoryForProduct, requiredQuantity) => {
    const productQuantityOnMarket = sellersInventoryForProduct.reduce((sum, { quantity }) => sum + quantity, 0);
    if (!productQuantityOnMarket) {
        throw new Error('Unfortunately there are no available product on the market');
    }
    if (requiredQuantity > productQuantityOnMarket) {
        throw new Error(`Unfortunately there are only ${productQuantityOnMarket} product(s) available on the market`);
    }
};

const fillWithBestPricesOrderPreference = Object.freeze([
    { key: 'price', direction: 'ascending', comparison: 'number' },
]);
const fillWithLargestSellersOrderPreference = Object.freeze([
    { key: 'quantity', direction: 'descending', comparison: 'number' },
    { key: 'price', direction: 'ascending', comparison: 'number' },
]);
const quicklyFillOrderPreference = Object.freeze([
    { key: 'deliveryWait', direction: 'ascending', comparison: 'number' },
    { key: 'price', direction: 'ascending', comparison: 'number' },
]);

class Buyer {
    constructor(market) {
        this.market = market;
    }

    /**
     * This function returns product related inventory  for the market extended with sellers' deliveryWait property
     */
    getSellersInventoryForProduct(product) {
        const { sellers } = this.market;
        if (!Array.isArray(sellers) || !sellers.length) {
            throw new Error('Sellers not found on the market');
        }
        const sellersInventoryForProduct = sellers
            .map(Seller => {
                const productInventory = (Seller.inventory || {})[product];
                if (!productInventory) return null;
                const { deliveryWait } = Seller;
                return { deliveryWait, ...productInventory, Seller };
            })
            .filter(v => v);
        if (!sellersInventoryForProduct.length) {
            throw new Error('Product not found on the market');
        }
        return sellersInventoryForProduct;
    }

    /**
     * This function returns an estimate on order price
     * while taking preference into account
     */
    fillOrderByPreference(product, quantity, sortOrderPreference) {
        const sellersInventoryForProduct = this.getSellersInventoryForProduct(product);
        checkMarketQuantity(sellersInventoryForProduct, quantity);
        const orderFunction = multiKeySort(sortOrderPreference);
        const sellersInventoryForProductSorted = sellersInventoryForProduct.sort(orderFunction);
        let remainingQuantityForCalculation = quantity;
        let priceSum = 0;

        // Using for... of instead of reduce because with break, it can come with greater performance.
        // eslint-disable-next-line no-restricted-syntax
        for (const sellersInventory of sellersInventoryForProductSorted) {
            const { quantity: sellerQuantity, Seller } = sellersInventory;
            const quantityRequiredFromSeller = remainingQuantityForCalculation > sellerQuantity
                ? sellerQuantity
                : remainingQuantityForCalculation;
            const { boughtQuantity, cost } = Seller.sell(product, quantityRequiredFromSeller);
            priceSum += cost;
            remainingQuantityForCalculation -= boughtQuantity;
            if (remainingQuantityForCalculation === 0) {
                break;
            }
        }
        return priceSum;
    }

    /**
     * This method should get the best price for a given product
     * across all sellers
     */
    getBestPrice(product) {
        const productPrices = this.getSellersInventoryForProduct(product).map(({ price }) => price);
        return Math.min(...productPrices);
    }

    /** Regarding the main.js console.log
     *  completelyFill function should be
     *  identical to fillWithBestPrices function
     */
    completelyFill(product, quantity) {
        return this.fillWithBestPrices(product, quantity);
    }

    /**
     * This method should optimise price when filling an order
     * if the quantity is greater than any single seller can accommodate
     * then the next cheapest seller should be used.
     */
    fillWithBestPrices(product, quantity) {
        return this.fillOrderByPreference(product, quantity, fillWithBestPricesOrderPreference);
    }

    /**
     * This method should optimise for sellers with the largest inventory when filling an order
     * if the quantity is greater than any single seller can accommodate
     * then the next largest seller should be used.
     * if multiple sellers have the same amount of inventory
     * you should use the cheaper of the two.
     */
    fillWithLargestSellers(product, quantity) {
        return this.fillOrderByPreference(product, quantity, fillWithLargestSellersOrderPreference);
    }

    /**
     * This function should optimise for sellers with (I assume) the lowest delivery wait when filling an order
     * if the quantity is greater than any single seller can accommodate
     * then the next largest seller should be used.
     * if multiple sellers have the same amount of inventory
     * you should use the cheaper of the two.
     */
    quicklyFill(product, quantity) {
        return this.fillOrderByPreference(product, quantity, quicklyFillOrderPreference);
    }
}

module.exports = { Buyer };
