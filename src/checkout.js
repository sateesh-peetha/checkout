const db = require('./db');
const utils = require("./utils");

exports.handler = async (event) => {

    let body = utils.parseRequestBody(event.body);

    if (body.errors) {
        let response = utils.resp(body.errors, 400);
        return new Promise(resolve => resolve(response));
    }

    try {

        // check if customer id is present in request
        if (!body.customerid) {
            let response = utils.resp({ 'message': 'customer id is missing' }, 400);
            return new Promise(resolve => resolve(response));
        }

        // get all open orders of customer
        let data = await db.openOrders(body.customerid);

        // no open orders. return empty array
        if (!data.order || data.order.length === 0) {
            let response = utils.resp({ data: [] }, 200);
            return new Promise(resolve => resolve(response));
        }

        // if no deals for the customer return default price
        if (noDeals(data.customer)) {
            let result = getDefaultPrice({
                order: data.order,
                product: data['ad-category']
            });

            let response = utils.resp({ order: result, totalPrice: totalPrice(result) }, 200);
            return new Promise(resolve => resolve(response));
        }


        const allowedDeals = [];
        // this step is required to track order of deals for priority while applying
        data.customer[0].deals.forEach(d => {
            const result = data.deal.filter(deal => deal.id == d);
            if (result.length > 0)
                allowedDeals.push(result[0]);
        });

        // if deals present then return discounted for each open order
        let result = getDiscountedPrice({
            allowedDeals: allowedDeals,
            order: data.order,
            product: data['ad-category'],
        });

        let response = utils.resp({ order: result, totalPrice: totalPrice(result) }, 200);
        return new Promise(resolve => resolve(response));

    }
    catch (err) {
        console.log(err);
        let response = utils.resp({ message: err }, 500);
        return new Promise(resolve => resolve(response));
    }

}

const totalPrice = (order) => {
    let price = 0;
    order.forEach(o => {
        price = price + o.discountedPrice;
    });
    return price;
}

const noDeals = (customer) => {

    // apply default pricing if no customer record present
    if (customer.length === 0)
        return true;

    if (customer.deals && customer.deals.length === 0)
        return true;


    return false;

}

const getPriceOfProduct = (categoryid, product) => {

    const price = product.filter(p => p.id === categoryid);

    if (price[0])
        return price[0].price;

    return 0;

}

const getDefaultPrice = (params) => {
    const { order, product } = params;
    let result = [];

    order.forEach(o => {
        let price = getPriceOfProduct(o.adcategory, product);
        result.push({
            ...o,
            orignalPrice: price * o.quantity,
            discountedPrice: price * o.quantity,
        });
    });

    return result;
}

const getDiscountedPrice = (params) => {
    const { allowedDeals,
        order,
        product } = params;

    let result = [];

    order.forEach(o => {
        let finalOrder = {};
        //allowedDeals.forEach(d => {
        for (let i = 0; i < allowedDeals.length; i++) {
            let d = allowedDeals[i];
            if (o.adcategory === d.adcategory) {
                let price = getPriceOfProduct(o.adcategory, product);
                finalOrder = applyDeal({ o, d, orignalPrice: price * o.quantity, price });
                break;
            }
        }
        //});

        if (finalOrder.discountedPrice) {
            result.push(finalOrder);
        }
        else {
            let price = getPriceOfProduct(o.adcategory, product);
            result.push({
                ...o,
                orignalPrice: price * o.quantity,
                discountedPrice: price * o.quantity,
            });
        }

    });

    return result;
}

// applies deal for different discount option

const applyDeal = (params) => {
    const { o, d, orignalPrice, price } = params;

    // example Gets a discount on Featured Ads where the price drops to 299.99 RM per ad
    if (d.type === 'price-discount') {
        return {
            ...o,
            orignalPrice: orignalPrice,
            discountedPrice: d.discountedPrice * o.quantity,
        };
    }

    // example Premium Ads where 4 or more are purchased. The price drops to
    //379.99 RM per ad
    if (d.type === 'lot-discount' && o.quantity >= d.discountedQuantity) {
        return {
            ...o,
            orignalPrice: orignalPrice,
            discountedPrice: d.discountedPrice * o.quantity,
        };
    }
    else if (d.type === 'lot-discount') {
        return {
            ...o,
            orignalPrice: orignalPrice,
            discountedPrice: orignalPrice,
        };
    }

    //Gets a “3 for 2” deal on Standard Ads

    if (d.type === 'quantity-discount' && o.quantity >= d.quantity) {
        let rem = o.quantity % d.quantity;

        discountedPrice = rem === 0 ?
            d.discountedQuantity * d.discountedPrice :
            (
                (((o.quantity - rem) / d.quantity) * d.discountedQuantity * d.discountedPrice) +
                (rem * price)
            );

        return {
            ...o,
            orignalPrice: orignalPrice,
            discountedPrice: discountedPrice,
        };
    }
    else if (d.type === 'quantity-discount') {
        return {
            ...o,
            orignalPrice: orignalPrice,
            discountedPrice: orignalPrice,
        };
    }


}