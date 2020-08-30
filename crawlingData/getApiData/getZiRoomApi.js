const { getMyHomeApiData } = require('./getMyHomeApiData') 
const { getMushRoomApiData } = require('./getMushRoomApiData') 

let getZiRoomApi = async (key) =>{
    // let ziRoomData = await getZiRoomApiData(key)
    // let eggShellData = await getEggShellApiData(key)
    // let myHomeData = await getMyHomeApiData(key)
    let mushRoomData = await getMushRoomApiData(key)
    
    let resultend = []
    // resultend = result.concat(ziRoomData)
    // resultend = resultend.concat(eggShellData)
    // resultend = resultend.concat(myHomeData)
    resultend = resultend.concat(mushRoomData)
    return resultend
}

module.exports = {
    getZiRoomApi
}