const getZiRoomData = require('./getZiRoomData') 

let getData = async (key) =>{
    let result = []
    let ziRoomData = await getZiRoomData(key)
    const { resultFirst, resultOther} = ziRoomData
    let resultend = result.concat(ziRoomData)
    return resultend
}

module.exports = getData