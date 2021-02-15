const { Seller } = require('./Seller');
const { getDeliveries } = require('./utilities');

class FairPriceSeller extends Seller {
    constructor(inventory, id = 'Safeway', deliveryWait = 5) {
        super(inventory, id, deliveryWait);
    }

    tick() {
        Object.values(this.inventory).forEach(value => {
            let inventory = value;
            const isReadyForDelivery = (inventory.priceHistory.length % this.deliveryWait) === 0;
            if (isReadyForDelivery) {
                inventory = getDeliveries(inventory, this.random_generator);
            }
            inventory.priceHistory.push(inventory.price);
        });
    }
}

module.exports = { FairPriceSeller };
