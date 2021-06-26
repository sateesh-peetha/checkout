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

            let response = utils.resp({ data: result }, 200);
            return new Promise(resolve => resolve(response));
        }

        // if deals present then return discounted for each open order
        let result = getDiscountedPrice({
            allowedDeals: data.customer[0].deals,
            order: data.order,
            product: data['ad-category'],
            deal: data.deal
        });

    }
    catch (err) {
        console.log(err);
    }

}

const noDeals = (customer) => {

    // apply default pricing if no customer record present
    if (customer.length === 0)
        return true;

    // no discounts if no deals for customer    
    if (!customer.deals)
        return true;

    if (customer.deals.length === 0)
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
            ...order,
            orignalPrice: price * o.quanity,
            discountedPrice: price * o.quanity,
        });
    });

    return result;
}