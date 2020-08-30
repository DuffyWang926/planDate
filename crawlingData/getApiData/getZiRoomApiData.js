const https = require('https');
const axios = require("axios");
const cheerio = require('cheerio');
const chalk = require('chalk')
const log = console.log

let getZiRoomApiData = async (key) =>{
    log(chalk.yellow('getZiRoomApiData begin'))
    let result = []
    let url = 'http://www.ziroom.com/z/'
    let headersText = `
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
    Accept-Encoding: gzip, deflate
    Accept-Language: zh-CN,zh;q=0.9
    Cache-Control: max-age=0
    Connection: keep-alive
    Cookie: td_cookie=2012615485; CURRENT_CITY_CODE=110000; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221739ed0acdf18b-08b5175540bf33-3323765-2073600-1739ed0ace02ab%22%2C%22%24device_id%22%3A%221739ed0acdf18b-08b5175540bf33-3323765-2073600-1739ed0ace02ab%22%2C%22props%22%3A%7B%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%7D%7D; gr_user_id=a7207c80-e0bb-4700-9468-178376a7abe7; td_cookie=2012573488; CURRENT_CITY_NAME=%E5%8C%97%E4%BA%AC; _csrf=xGyOZEQaY9Etv3zs6oTABSCbTTYUHZBj; Hm_lvt_4f083817a81bcb8eed537963fc1bbf10=1596097343,1596423672; gr_session_id_8da2730aaedd7628=72a8174c-1ce4-4f0b-8fc8-72c6ac1a3a95; gr_session_id_8da2730aaedd7628_72a8174c-1ce4-4f0b-8fc8-72c6ac1a3a95=true; Hm_lpvt_4f083817a81bcb8eed537963fc1bbf10=1596424291
    Host: www.ziroom.com
    Referer: http://www.ziroom.com/
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
        qwd:key
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
    log(chalk.yellow('getZiRoomApiData end'))
    return result

}

let getDataFromHtml = (data) =>{
    const $ = cheerio.load(data);
    let result = []
    let items = $('div.item')
    items.each((i,e) =>{
        let item = cheerio.load(e)
        let len = item('span').length
        if(len > 5){
            let detail = item('a.pic-wrap')
            let detailUrl = detail.attr('href')
            if(!detailUrl.includes('http://')){
                detailUrl = detailUrl.replace('//','http://')
            }
            let img = item('img.lazy')
            let imgSrc = img.attr('src')
            if(!imgSrc.includes('http://')){
                imgSrc = imgSrc.replace('//','http://')
            }
            let titleNode = item('.title>a')
            let title = titleNode.text().trim()
            let descriptions = item('div.desc').find('div')
            let floorData = descriptions.eq(0).text()
            let floorArr = floorData.split('|')
            let area = ''
            let floor = ''
            let floorTotal = ''
            if (floorArr.length > 0){
                area = floorArr[0]
                floorTotalData = floorArr[1]
                floor = floorTotalData.split('/')[0]
                floorTotal = floorTotalData.split('/')[1].replace('层','').trim()
            }
            let distanceNode = item('div.location')
            let distance = distanceNode.text().trim().replace('\n','').replace('\t','').replace(' ','')
            let priceList = [] 
            let priceNodeList = item('span.num').each((i,v) =>{
                let styleText = item(v).attr('style').replace('//','http://') 
                priceList.push(styleText) 
            })
            let tagList = []
            item('div.tag>span').each((j,v) =>{
                let text = item(v).text()
                tagList.push(text)
            })
            let res = { 
                imgSrc:imgSrc,
                title:title,
                area:area,
                floor:floor,
                floorTotal:floorTotal,
                distance:distance,
                price:priceList,
                tagList:tagList,
                detailUrl:detailUrl
            }
            
            result.push(res)
        }
    })
    return result
}

module.exports =  { 
    getZiRoomApiData,
    getDataFromHtml
} 
