const stream = require('stream');
const rand = require('random-seed');

class Buyer{
    constructor(stingynessFactor, quantityCap){
        this.stingynessFactor = stingynessFactor
        this.quantityCap = quantityCap
    }

    Buy(quantity){

    }
    
}

class Seller {
    constructor(inventory){
        this.inventory = inventory;

        for (let [key, value] of Object.entries(inventory)) {
            value.startingQuantity = value.quantity;
            value.stingyness = 0;
        }

        this.priceStream = stream.Readable();
    }

    quote(product){
        const inventory = this.inventory[product];
        return inventory.price;
    }

    recalculatePrice(iProduct) {
        const seed = "JUST FOR TESTS";
        let gen = rand.create(seed);
        let fluctuation = gen(100)/100;
        let mood = ( fluctuation+ iProduct.stingyness) / 2;
        let priceChange = mood < 0.5 ?  mood : 0.5 - mood ;
        iProduct.price = iProduct.price + (iProduct.price * (priceChange / 100));
        return iProduct;
    }

    sell(product, buyQuantity){
        const inventory = this.inventory[product];
        const quantityCap = buyQuantity > inventory.quantity ? inventory.quantity : buyQuantity; 
        inventory.quantity -= quantityCap;
        inventory.stingyness = 1-inventory.quantity / inventory.startingQuantity;
        this.recalculatePrice(inventory); 
        return quantityCap;
    }

}

module.exports = {Seller, Buyer}