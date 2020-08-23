const https = require('https');
const axios = require("axios");
const cheerio = require('cheerio');
const { slice } = require('lodash');
 

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
    let items = $('ul.pList > li')
    items.each((i,e) =>{
        let item = cheerio.load(e)
        let detail = item('div.listImg > a') 
        let detailUrl = detail.attr('href')
        if(!detailUrl.includes('http')){
            if(detailUrl.includes('//')){
                detailUrl.replace('//','http://')
            }else{
                detailUrl = 'http:/' + detailUrl
            }
            
        }
        let img = item('div.listImg > a > img')
        let imgSrc = img.attr('src') 
        if (!imgSrc){
            imgSrc = img.attr('data-src')
        }
        if (!imgSrc.includes('http')){
            imgSrc.replace('//','http://')
        }
        let titleNode = item('div.listCon > h3>a')
        let title = titleNode.text().trim()
        let pList= item('div.listX > p')
        let area = ''
        let floor = ''
        let floorTotal = ''
        let distance = ''
        if (pList.length > 1){
            let textList = item('div.listX > p:nth-child(1)').text().split('·')
            if (textList.length > 3){
                area = textList[1].trim().slice(0,3)
                let floorData = textList[3].trim().split('/')
                if (floorData.length > 1){
                    floor = floorData[0]
                    floorTotal = floorData[1].slice(0,-1)
                }
            }
            distance = item('div.listX > p:nth-child(2) > a:nth-of-type(2)').text()
            
        }
        let price = item('p.redC > strong').text()
        

        let res = { 
            imgSrc:imgSrc,
            title:title,
            area:area,
            floor:floor,
            floorTotal,
            distance:distance,
            price,
            tagList:[],
            detailUrl:detailUrl
        }
        
        result.push(res)
    })
    return result
}

module.exports =  { getEggShellApiData, getDataFromHtml} 
