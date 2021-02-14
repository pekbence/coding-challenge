/* eslint-disable no-console */
const { asda, costco, budgens } = require('./marketplace');
const { Market } = require('./Market');
const { Buyer } = require('./Buyer');

function buyerFunctions(product, quantity, buyer) {
    console.log(`The best price for ${product} is ${buyer.getBestPrice(product)}`);
    // eslint-disable-next-line max-len
    console.log(`To completely fill an order of ${quantity} ${product} costs ${buyer.completelyFill(product, quantity)}`);
    console.log(`To buy as quickly as possible ${quantity} ${product} costs ${buyer.quicklyFill(product, quantity)}`);
    // eslint-disable-next-line max-len
    console.log(`To buy from the fewest sellers ${quantity} ${product} costs ${buyer.fillWithLargestSellers(product, quantity)}`);
}

// eslint-disable-next-line no-unused-vars
function observeMarket(market) {
    market.observable.subscribe(mkt => {
        console.log(`The current price of apples are ${market.sellers[0].inventory.Apples.price}`);
    });
}

function main() {
    const market = new Market([asda, budgens, costco]);
    const buyer = new Buyer(market);
    const product = 'Apples';
    const quantity = 10;
    buyerFunctions(product, quantity, buyer);
    // observeMarket(market);
}

main();
