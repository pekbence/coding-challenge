const expect = require('expect');
const cloneDeep = require('lodash.clonedeep');
const { Market } = require('../Market');
const { Buyer } = require('../Buyer');
const marketplace = require('./utilities/marketplace.test');

const sortOrderPreference = Object.freeze([
    { key: 'quantity', direction: 'descending', comparison: 'number' },
    { key: 'price', direction: 'ascending', comparison: 'number' },
]);

describe('Buyer', () => {
    let buyer;
    let market;
    let originalMarketPlace;
    beforeEach(() => {
        originalMarketPlace = cloneDeep(marketplace);
        market = new Market([...Object.values(originalMarketPlace)]);
        buyer = new Buyer(market);
    });

    it('should not throw error when there are just enough products on the market', () => {
        expect(buyer.fillOrderByPreference('Apples', 375, sortOrderPreference)).toEqual(2193.75);
    });

    it('should throw error when there are not enough products on the market', () => {
        expect(() => buyer.fillOrderByPreference('Apples', 376, sortOrderPreference))
            .toThrow('Unfortunately there are only 375 produce available on the market');
    });

    it('should throw error when there are no produce on the market at all', () => {
        expect(() => buyer.getBestPrice('notExistingProduce'))
            .toThrow('Produce not found on the market');
    });
});
