// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const { getLocalData } = require('./localData');


exports.openOrders = async (customerid) => {

    if (process.env.stage === "local") {
        return new Promise(resolve => resolve(getLocalData(customerid)));
    }
    else {
        //add logic to get the data later
    }

}

//console.log(getLocalData("66"));