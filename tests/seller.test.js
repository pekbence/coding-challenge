const expect = require("expect")
const {Seller} = require("../main")


describe("Seller", function(){
    var sellerInventory;
    beforeEach(() => {
        sellerInventory = {
            "Apples":{
                quantity:100,
                price:5.25
            },
            "Oranges":{
                quantity:150,
                price:8.0
            },
            "Pears":{
                quantity:10,
                price:15.0
            }
        }
    })

    it("should reduce quantity when i sell", ()=> {
        let sut = new Seller(sellerInventory)
        sut.sell("Apples", 25)
        expect(sut.inventory["Apples"].quantity).toEqual(75)
    });

    it("should cap at 0 if I sell more than i have", () =>{
        let sut = new Seller(sellerInventory);
        sut.sell("Apples", 105);
        expect(sut.inventory["Apples"].quantity).toEqual(0);
    });

    it('should be maximally stingy when empty inventory', () => {
        let sut = new Seller(sellerInventory);
        sut.sell("Apples", 105);
        expect(sut.inventory["Apples"].stingyness).toEqual(1);
    });

    it("should be minimally stingy when full inventory", () => {
        let sut = new Seller(sellerInventory);
        expect(sut.inventory["Apples"].stingyness).toEqual(0);
    });

    it("should be somewhat stingy when half inventory", () => {
        let sut = new Seller(sellerInventory);
        sut.sell("Apples", sut.inventory["Apples"].quantity/2);
        expect(sut.inventory["Apples"].stingyness).toEqual(0.5);
    });

    it("should quote initial price on first ask", ()=>{
        let sut = new Seller(sellerInventory);
        expect(sut.inventory["Oranges"].price).toEqual(8.0);
    });

    it("should raise prices after seller buys", () =>{
        let sut = new Seller(sellerInventory);
        console.log(sut.inventory["Oranges"].price);
        expect(sut.inventory["Oranges"].price).toBeGreaterThan(8.0);
    });

})

