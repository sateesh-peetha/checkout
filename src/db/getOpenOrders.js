// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const { getLocalData } = require('./localData');

exports.openOrders = async (customerid) => {

    if (process.env.stage === "local") {
        return new Promise(resolve => resolve(getLocalData(customerid)));
    }
    else {
        // if other environment then get data from aws dynamodb tables
        const data = await Promise.all([
            getProduct(),
            getDeals(),
            getCustomer(customerid),
            getOrders(customerid)
        ]);
        return new Promise(resolve => resolve({
            'ad-category': data[0],
            deal: data[1],
            customer: data[2],
            order: data[3]
        }));
    }
}

//console.log(getLocalData("66"));

// returns items in ad-category
const getProduct = async () => {
    var params = {
        TableName: process.env.productTable
    };
    const data = await docClient.scan(params).promise();
    return new Promise(resolve => resolve(data.Items));
}

const getDeals = async () => {
    var params = {
        TableName: process.env.dealTable
    };
    const data = await docClient.scan(params).promise();
    return new Promise(resolve => resolve(data.Items));
}

const getCustomer = async (customerid) => {
    var params = {
        TableName: process.env.customerTable,
        Key: {
            id: customerid
        }
    };
    const data = await docClient.get(params).promise();
    return new Promise(resolve => resolve(data.Item || []));
}

const getOrders = async (customerid) => {
    var params = {
        TableName: process.env.orderTable,
        ScanFilter: {
            'customerid': {
                ComparisonOperator: EQ,
                AttributeValueList: [customerid]
            },
            'status': {
                ComparisonOperator: EQ,
                AttributeValueList: ['OPEN']
            },
        },
    };
    const data = await docClient.scan(params).promise();
    return new Promise(resolve => resolve(data.Items));
}
