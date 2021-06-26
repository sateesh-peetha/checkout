const response = require('./response');
//const validationService = require('./validation');
const {parseRequestBody} = require('./request');

exports.resp = response.resp;
exports.parseRequestBody = parseRequestBody;