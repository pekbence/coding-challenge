const stream = require('stream');
const rand = require('random-seed');

function recalculatePrices(id, iProduct, deliveryWait) {
    const isReadyForDelivery = (iProduct.priceHistory.length % deliveryWait) == 0;
    if (isReadyForDelivery) {
        iProduct = getDeliveries(iProduct, id);
    }
    let fluctuation = getFluctuation(id);
    let mood = (fluctuation + iProduct.stingyness) / 2;
    let priceChange = mood < 0.5 ? -mood : mood - 0.5;
    iProduct.price = iProduct.price + (iProduct.price * (priceChange / 10));
    iProduct.priceHistory.push(iProduct.price);
    return iProduct;
}
function getFluctuation(id) {
    let gen = rand.create(id);
    gen(10);
    return gen(10) / 10;
}
function getDeliveries(iProduct, id) {
    let fluctuation = getFluctuation(id);
    let newDeliveries = fluctuation * iProduct.startingQuantity;
    iProduct.quantity += iProduct.quantity + newDeliveries;
    return iProduct;
}
class Seller {
    constructor(inventory, id = "Asda", deliveryWait = 5) {
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
    sell(product, buyQuantity) {
        const inventory = this.inventory[product];
        const boughtQuantity = buyQuantity > inventory.quantity ? inventory.quantity : buyQuantity;
        const cost = boughtQuantity * this.quote(product);
        inventory.quantity -= boughtQuantity;
        inventory.stingyness = 1 - inventory.quantity / inventory.startingQuantity;
        recalculatePrices(this.id, inventory, this.deliveryWait);
        return {boughtQuantity, cost};
    }
    tick(product) {
        const inventory = this.inventory[product];
        recalculatePrices(this.id, inventory, this.deliveryWait);
        return product;
    }
}


module.exports = {Seller}
