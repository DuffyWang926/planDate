const https = require('https');
const axios = require("axios");
const cheerio = require('cheerio');
 

let getEggShellApiData = async (key) =>{
    let result = []
    let url = 'https://www.danke.com/room/bj'
    let headersText = `
    Referer: https://www.danke.com/
    Upgrade-Insecure-Requests: 1
    User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36
    `
    let headersList = headersText.trim().split('\n')
    let headers = {}
    headersList.map((v,i) =>{
        let list = v.split(':')
        let others = list.slice(1).join('')
        let name = list[0].trim()
        let value = others.trim().replace('//', "://")
        headers[name] = value
    })
    let params = {
        search_text:key
    }
    let response = await axios({
        method: "GET",
        // headers: { "Content-Type": "application/x-www-form-urlencoded" },
        url: url,
        // data: Qs.stringify(param)
        params
     })
    const { data } = response
    result = getDataFromHtml(data)
    return result

}

let getDataFromHtml = (data) =>{
    const $ = cheerio.load(data);
    let result = []
    let items = $('div.r_lbx')
    items.each((i,e) =>{
        let item = cheerio.load(e)
        let img = item('img')
        let imgSrc = img.attr('src')
        let titleDiv = item('div.r_lbx_cena')
        let titleNode = titleDiv.find('a')
        let title = titleNode.text().trim()
        let detailUrl = titleNode.attr('href')
        let detailContent = item('div.r_lbx_cenb').text()
        let detailConList = detailContent.trim().split('|')
        let area = 0
        let floor = 0
        if (detailConList.length > 2){
            area = detailConList[0].trim().slice(-3)
            floor = detailConList[1].trim().slice(0,-1)

        }
        let distanceDiv = item('div.r_lbx_cena')
        let distance = distanceDiv.find('div.r_lbx_cena').text().trim()
        let tagDiv = item('div.r_lbx_cenc')
        let tagList = []
        let tagDivList = tagDiv.find('span')
        tagDivList.each((i,v) =>{
            let text = item(v).text()
            tagList.push(text)
        })
        let priceDiv = item('div.r_lbx_moneya')
        let price = priceDiv.find('span.ty_b').text()   
        
        let res = { 
            imgSrc:imgSrc,
            title:title,
            area:area,
            floor:floor,
            floorTotal:0,
            distance:distance,
            price,
            tagList:tagList,
            detailUrl:detailUrl
        }
        
        result.push(res)
    })
    return result
}

module.exports =  { getEggShellApiData, getDataFromHtml} 
