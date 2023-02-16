const navEl = document.getElementById("nav");

const keys = {
    ocr: "bWNAku3qXipL0kM4bhpGoDrcfS0K0P9t"
};


const regex = {
    nif: /[ABCDEFGHJKLMNPQRSUVW][- ]?\d{7}[0-9A-J]/i,
    socialName: /[A-Z0-9\s]*[\s\,]{1,}(S.?L.?|S.?I.?|S.?A.?|S.?4.?|S.?COOP.?)/i,
    startProducts: /(import|articulo|descripcio|\-{3,})/gim,
    //startProducts: /[(import)(pvp)\-{3,}]/gim,
    //startProducts: /\-{3,}/gim,
    stopProducts: /total/gim,
    numWComma: /^\d{1,}\,\d{1,4}$/i,
    cleanText: /[a-z0-9,.\s]/gi
}


class Shop {
    constructor(nif, name, location) {
        this.nif = nif;
        this.name = name;
        this.location = location;
    }
}


class User {
    constructor(id) {
        this.id = id;
    }
}


class Product {
    constructor(sku, name, price, date, provider, amount) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.date = date;
        this.provider = provider;
        this.amount = amount;
    }
}


class Ticket {
    constructor(nif, date, shop, user, products, total) {
        this.nif = nif;
        this.date = date;
        this.shop = shop;
        this.user = user;
        this.products = products;
        this.total = total;
    }

    export() {
        return {
            date: this.date,
            shop: this.shop,
            user: this.user,
            products: this.products,
            total: this.total
        }
    }
}