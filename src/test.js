const { handler } = require('./checkout');
console.log("in test function");
(async function f() {
    process.env.stage = 'local';
    console.log("came here");
    const result = await handler({ body: { customerid: "1" } });
    console.log(result);
})();