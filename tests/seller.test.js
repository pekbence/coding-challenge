const expect = require('expect');
const { Seller } = require('../Seller');

describe('Seller', () => {
    let sellerInventory;
    beforeEach(() => {
        sellerInventory = {
            Apples: {
                quantity: 100,
                price: 5.25,
            },
            Oranges: {
                quantity: 150,
                price: 8.0,
            },
            Pears: {
                quantity: 10,
                price: 15.0,
            },
        };
    });

    it('should reduce quantity when i sell', () => {
        const sut = new Seller(sellerInventory);
        sut.sell('Apples', 25);
        expect(sut.inventory.Apples.quantity).toEqual(75);
    });

    it('should cap at 0 if I sell more than i have', () => {
        const sut = new Seller(sellerInventory);
        sut.sell('Apples', 105);
        expect(sut.inventory.Apples.quantity).toEqual(0);
    });

    it('should be maximally stingy when empty inventory', () => {
        const sut = new Seller(sellerInventory);
        sut.sell('Apples', 105);
        expect(sut.inventory.Apples.stinginess).toEqual(1);
    });

    it('should be minimally stingy when full inventory', () => {
        const sut = new Seller(sellerInventory);
        expect(sut.inventory.Apples.stinginess).toEqual(0);
    });

    it('should be somewhat stingy when half inventory', () => {
        const sut = new Seller(sellerInventory);
        sut.sell('Apples', sut.inventory.Apples.quantity / 2);
        expect(sut.inventory.Apples.stinginess).toEqual(0.5);
    });

    it('should quote initial price on first ask', () => {
        const sut = new Seller(sellerInventory);
        expect(sut.inventory.Oranges.price).toEqual(8.0);
    });

    it('should raise prices after seller buys', () => {
        const sut = new Seller(sellerInventory, 'Kwiksave');
        sut.sell('Oranges', sut.inventory.Oranges.quantity / 2);
        expect(sut.inventory.Oranges.price).toBeGreaterThan(8.0);
    });

    it('should get deliveries after seller buys once', () => {
        const deliveryCadence = 1;
        const sut = new Seller(sellerInventory, 'Asda', deliveryCadence);
        sut.sell('Oranges', 1);
        expect(sut.inventory.Oranges.quantity)
            .toBeGreaterThan(sut.inventory.Oranges.startingQuantity);
    });

    it('should be able to set delivery schedule', () => {
        const deliveryCadence = 3;
        const sut = new Seller(sellerInventory, 'Asda', deliveryCadence);
        const allOranges = sut.inventory.Oranges.quantity;
        sut.sell('Oranges', allOranges);
        expect(sut.inventory.Oranges.quantity).toEqual(0);
        sut.tick('Oranges');
        expect(sut.inventory.Oranges.quantity).toEqual(0);
        sut.tick('Oranges');
        expect(sut.inventory.Oranges.quantity).toBeGreaterThan(0);
    });

    it('should return correct receipt when seller sells single unit', () => {
        const sut = new Seller(sellerInventory);
        const buyAmount = 10;
        const receipt = sut.sell('Oranges', buyAmount);
        expect(receipt.cost).toEqual(sut.inventory.Oranges.priceHistory[0] * buyAmount);
        expect(receipt.boughtQuantity).toEqual(buyAmount);
    });

    it('should return correct receipt when seller sells all stock', () => {
        const sut = new Seller(sellerInventory);
        const overboughtAmount = 1000;
        const expectedBuyAmount = sut.inventory.Oranges.startingQuantity;
        const receipt = sut.sell('Oranges', overboughtAmount);
        expect(receipt.cost).toEqual(sut.inventory.Oranges.priceHistory[0] * expectedBuyAmount);
        expect(receipt.boughtQuantity).toEqual(expectedBuyAmount);
    });
});
