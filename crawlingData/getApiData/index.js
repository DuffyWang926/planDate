const getZiRoomApi = require('./getZiRoomApi')
module.exports = {
    'GET /city': fn_city,
    'GET /region/:city': fn_city_region,
};