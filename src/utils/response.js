const resp = (r, statusCode) => {
    const e = {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': process.env.sameOriginHeader || '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Methods': "GET,HEAD,OPTIONS,POST,PUT",
            'Access-Control-Allow-Headers': "*,authorizer,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
        },
        body: JSON.stringify(r)
        ,
    };
    return e;
};

exports.resp = resp;