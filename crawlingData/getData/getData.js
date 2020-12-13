const getZiRoomData = require('./getZiRoomData') 
const getEggShellData = require('./getEggShellData') 
const getMyHomeData = require('./getMyHomeData') 
// const getMushRoomData = require('./getMushRoomData') 

let getData = async (key) =>{
    let result = []
    let ziRoomData = await getZiRoomData(key)
    const { resultFirst = [], resultOther = []} = ziRoomData

    // let eggShellData = await getEggShellData(key)
    // const { resultFirstEgg = [], resultOtherEgg = [] } = eggShellData

    // let myHomeData = await getMyHomeData(key)
    // let mushRoomData = await getMushRoomData(key)
    
    let resultend = []
    resultend = resultend.concat(resultFirst)
    resultend = resultend.concat(resultOther)
    // resultend = resultend.concat(resultFirstEgg)
    // resultend = resultend.concat(resultOtherEgg)
    // resultend = resultend.concat(myHomeData)
    // resultend = resultend.concat(mushRoomData)
    

    return resultend
}

module.exports = getData