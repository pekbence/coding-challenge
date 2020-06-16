const {marketPlace} = require("./marketplace");
const { Buyer } = require("./Buyer");


function main(){
    const market = marketPlace;
    let buyer = new Buyer(market);
    let product = "Apples";
    let quantity = 10;
    // Task
    console.log(`The best price for ${product} is ${buyer.getBestPrice(product)}`) ;
    console.log(`To completely fill a order of ${quantity} ${product} costs ${buyer.completelyFill(product,quantity)}`) ;
    console.log(`To buy as quickly as possible ${quantity} ${product} costs ${buyer.quicklyFill(product,quantity)}`) ;
};