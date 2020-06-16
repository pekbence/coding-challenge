const stream = require('stream');
const rand = require('random-seed');


function getExpectedChange(id) {
    let gen = rand.create(id);
    gen(10);
    return gen(10) / 10;
}

function getDeliveries(iProduct, id) {
    let fluctuation = getExpectedChange(id);
    let newDeliveries = fluctuation * iProduct.startingQuantity;
    iProduct.quantity += iProduct.quantity + newDeliveries;
    return iProduct;
}

class Seller {
    constructor(inventory, id = "Safeway", deliveryWait = 5) {
        this.inventory = inventory;
        this.deliveryWait = deliveryWait;
        this.id = id;
        for (let [key, value] of Object.entries(inventory)) {
            value.startingQuantity = value.quantity;
            value.stingyness = 0;
            value.priceHistory = [value.price];
        }
        this.priceStream = stream.Readable();
    }
    quote(product) {
        const inventory = this.inventory[product];
        return inventory.price;
    }

    calculatePriceChange(product){
        const inventory = this.inventory[product];
        const v = 0.5
        const ec = getExpectedChange(this.id);
        const alpha = inventory.startingQuantity
        const beta = inventory.quantity
        const sentimentChange = Math.log10(beta/alpha)*(-v) + (ec - 0.5)
        return sentimentChange;
    }
    
    sell(product, buyQuantity) {
        const inventory = this.inventory[product];
        const boughtQuantity = buyQuantity > inventory.quantity ? inventory.quantity : buyQuantity;
        const cost = boughtQuantity * this.quote(product);
        inventory.quantity -= boughtQuantity;
        inventory.stingyness = 1 - inventory.quantity / inventory.startingQuantity;
        this.tick();
        return {boughtQuantity, cost};
    }


    tick() {
        for (let [product, value] of Object.entries(this.inventory)) {
            let inventory = value;
            const isReadyForDelivery = (inventory.priceHistory.length % this.deliveryWait) == 0;
            if (isReadyForDelivery) {
                inventory = getDeliveries(inventory, this.id);
            }
            let chg = this.calculatePriceChange(product);
            inventory.price = inventory.price + (inventory.price*chg)
            inventory.priceHistory.push(inventory.price);
        }
    }
}


module.exports = {Seller}
