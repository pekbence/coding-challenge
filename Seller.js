const stream = require('stream');
const rand = require('random-seed');

function getExpectedChange(generator) {
    /* Based on the given formula ec should be between 0 and 1 (both side inclusive)
     * so I changed the original implementation which was exclusive from the right
     * (generator was not able to reach number 100)
     */
    return generator.intBetween(0, 100) / 100;
}

function getDeliveries(iProduct, generator) {
    const fluctuation = getExpectedChange(generator);
    const newDeliveries = fluctuation * iProduct.startingQuantity;
    iProduct.quantity += iProduct.quantity + newDeliveries;
    return iProduct;
}

class Seller {
    constructor(inventory, id = 'Safeway', deliveryWait = 5) {
        this.inventory = inventory;
        this.deliveryWait = deliveryWait;
        this.random_generator = rand(id);
        this.id = id;
        for (const [key, value] of Object.entries(inventory)) {
            value.startingQuantity = value.quantity;
            value.priceHistory = [value.price];
            value.stinginess = 0;
        }
    }

    quote(product) {
        const inventory = this.inventory[product];
        return inventory.price;
    }

    calculatePriceChange(product) {
        const inventory = this.inventory[product];
        const v = 0.1;
        const ec = getExpectedChange(this.random_generator);
        /*
         * If starting inventory is 0 then Math.log10(beta / alpha) will return infinity.
         * If current inventory is 0 then Math.log10(beta / alpha) will return negative infinity.
         *
         * In my opinion we should only calculate invBasedChange if we have both alpha and beta else
         * we should set it to 0.
         * Market sentiment could still change so we can calculate with it,
         * but the best solution would be to ask the business analyst for a flawless formula.
         *
         * Now I'm updating it based on my opinion to show what I meant.
         *
         */
        const alpha = inventory.startingQuantity;
        const beta = inventory.quantity;
        /*
        * I would also ask the business analyst if we really should use 10 based logarithm in the algorithm
        * in some areas / cases 'log' means natural (e based) logarithm.
        */
        const invBasedChange = (alpha && beta) ? (Math.log10(beta / alpha) * (-v)) : 0;
        const sentimentChange = invBasedChange + ((ec - 0.5) * v);

        return sentimentChange;
    }

    sell(product, buyQuantity) {
        const inventory = this.inventory[product];
        const boughtQuantity = buyQuantity > inventory.quantity ? inventory.quantity : buyQuantity;
        const cost = boughtQuantity * this.quote(product);
        inventory.quantity -= boughtQuantity;
        inventory.stinginess = 1 - inventory.quantity / inventory.startingQuantity;
        this.tick();
        return { boughtQuantity, cost };
    }

    tick() {
        for (const [product, value] of Object.entries(this.inventory)) {
            let inventory = value;
            const isReadyForDelivery = (inventory.priceHistory.length % this.deliveryWait) == 0;
            if (isReadyForDelivery) {
                inventory = getDeliveries(inventory, this.random_generator);
            }
            const chg = this.calculatePriceChange(product);
            /*
            * In rare cases we can get prices we don't really want
            * like negative prices, that can happen in some markets,
            * but maybe some of the sellers wants to avoid it.
            * or extremely high prices
            *
            * Markets can have regulations regarding the price as well.
            *
            * Javascript also have limitations regarding the number type
            * I would add a minimumPrice and a maximumPrice property to the inventories
            * with defaults that safeguard javascript number from overflow.
            */
            inventory.price += (inventory.price * chg);
            inventory.priceHistory.push(inventory.price);
        }
    }
}

module.exports = { Seller };
