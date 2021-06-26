exports.parseRequestBody = (body) => {
    try {
        if (typeof body === 'object' && body !== null && Object.keys(body).length !== 0) {
            return body;
        }
        else if (typeof body === 'string') {
            return JSON.parse(body);
        }
        else {
            return { "error": "Invalid Request Body" };
        }
    }
    catch (err) {
        return { "error": "Invalid Request Body" };
    }
};