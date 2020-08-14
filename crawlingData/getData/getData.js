const getZiRoomData = require('./getZiRoomData') 
const getEggShellData = require('./getEggShellData') 

let getData = async (key) =>{
    let result = []
    // let ziRoomData = await getZiRoomData(key)
    // const { resultFirst = [], resultOther = []} = ziRoomData

    let eggShellData = await getEggShellData(key)
    const { resultFirstEgg = [], resultOtherEgg = [] } = eggShellData
    let resultend = []
    // resultend = result.concat(resultOther)
    resultend = result.concat(resultOtherEgg)

    return resultend
}

module.exports = getData