const db = require('./sampleData.json');

exports.getLocalData = (customerid) => {
    return {
        "ad-category" : db['ad-category'],
        "deal" : db.deal,
        "customer" : db.customer.filter((c)=>c.id === customerid),
        "order" : db.order.filter((o)=>o.customerid === customerid)
    }
}