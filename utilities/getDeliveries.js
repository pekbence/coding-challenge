const getExpectedChange = require('./getExpectedChange');

module.exports = (iProduct, generator) => {
    const product = iProduct;
    const fluctuation = getExpectedChange(generator);
    const newDeliveries = fluctuation * product.startingQuantity;
    product.quantity += product.quantity + newDeliveries;
    return product;
};
