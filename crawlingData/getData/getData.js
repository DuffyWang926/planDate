const getZiRoomData = require('./getZiRoomData') 
const getEggShellData = require('./getEggShellData') 
const getMyHomeData = require('./getMyHomeData') 

let getData = async (key) =>{
    let result = []
    // let ziRoomData = await getZiRoomData(key)
    // const { resultFirst = [], resultOther = []} = ziRoomData

    // let eggShellData = await getEggShellData(key)
    // const { resultFirstEgg = [], resultOtherEgg = [] } = eggShellData

    let myHomeData = await getMyHomeData(key)
    
    let resultend = []
    // resultend = resultend.concat(resultFirst)
    // resultend = resultend.concat(resultOther)
    // resultend = resultend.concat(resultFirstEgg)
    // resultend = resultend.concat(resultOtherEgg)
    resultend = resultend.concat(myHomeData)
    

    return resultend
}

module.exports = getData