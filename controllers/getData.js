const http = require('http');
const lodash = require('lodash');
const urlib = require("url");
const getZiRoomApi = require('../crawlingData/getApiData/getZiRoomApi.js')
const getData = require('../crawlingData/getData/getData.js')
var fn_roomList = async (ctx, next) => {
    console.log(ctx,next,'ctx','next')
    let urlParams = urlib.parse(ctx.request.url,true)
    const { key, isAll } = urlParams.query
    let result = []
    if(isAll){
        result = await getData(key)
    }else{
        result = await getZiRoomApi.getZiRoomApi(key)
    }
    ctx.response.body = {
        data:result
    }
};

module.exports = {
    'GET /roomList': fn_roomList,
};