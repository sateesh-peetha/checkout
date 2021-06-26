const { handler } = require('./checkout');
console.log("in test function");
(async function f() {
    process.env.stage = 'local';
    
    console.log("Testing for customer default no deals");
    let result = await handler({ body: { customerid: "66" } });
    console.log(result);

    console.log("Testing for customer UEM Sunrise");
    result = await handler({ body: { customerid: "1" } });
    console.log(result);

    console.log("Testing for customer Sime Darby Property Bhd.");
    result = await handler({ body: { customerid: "2" } });
    console.log(result);

    console.log("Testing for customer  IGB Berhad");
    result = await handler({ body: { customerid: "3" } });
    console.log(result);

})();