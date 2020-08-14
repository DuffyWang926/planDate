const https = require('https');
const axios = require("axios");
const cheerio = require('cheerio');
const { getZiRoomApiData } = require('./getZiRoomApiData') 
const getEggShellApiData = require('./getEggShellApiData') 

let getZiRoomApi = async (key) =>{
    let result = []
    let ziRoomData = await getZiRoomApiData(key)
    let eggShellData = await getEggShellApiData(key)
    let resultend = result.concat(ziRoomData)
    resultend = resultend.concat(eggShellData)
    return resultend
}

module.exports = {
    getZiRoomApi
}