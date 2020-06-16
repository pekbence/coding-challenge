class Market {
    constructor(sellers) {
        this.sellers = sellers;
    }

    tick(){
        this.sellers.forEach(seller => {
            seller.tick()
        });
    }
}
exports.Market = Market;
