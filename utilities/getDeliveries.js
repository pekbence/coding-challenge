const getExpectedChange = require('./getExpectedChange');

module.exports = (iProduct, generator) => {
    const product = iProduct;
    const fluctuation = getExpectedChange(generator);
    /*
    * Regarding the documentation, quantity should be integer but here it can happen that it turns into float,
    * fixed it
    */
    const newDeliveries = Math.floor(fluctuation * product.startingQuantity);
    product.quantity += product.quantity + newDeliveries;
    return product;
};
