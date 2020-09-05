const https = require('https');
const axios = require("axios");
const cheerio = require('cheerio');
const { slice } = require('lodash');
const urlencode = require('urlencode');

let getMyHomeApiData = async (key) =>{
    let result = []
    let urlInit = key + '?zn=' + key
    let urlEnd = urlencode(urlInit)
    
    let url = 'https://bj.5i5j.com/zufang/w3/' + '_' +   urlEnd
    let headersText = `
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
    Accept-Encoding: gzip, deflate, br
    Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8
    Connection: keep-alive
    Cookie: _ga=GA1.2.375043681.1594694578; yfx_c_g_u_id_10000001=_ck20071410425814585459513721331; _dx_uzZo5y=931f60c3a4ae43f35b8a96436299fd5aa97f4521c2ebd437b2d9c6946c78ff888246bdd6; yfx_f_l_v_t_10000001=f_t_1594694578442__r_t_1595574906075__v_t_1595574906075__r_c_1; __TD_deviceId=51GP8AL7906QJ7UO; gr_user_id=8cdc0a86-92cb-4297-99f5-160e7cb31bc5; smidV2=202007241515106ced53c9547b879d4a6419c58052ad1b00b71af5ddc10ef80; Hm_lvt_94ed3d23572054a86ed341d64b267ec6=1595574911; grwng_uid=b22154c7-3c0c-4bed-b7c3-1a92715cda79; _Jo0OQK=5BC366133F302C323B01D650DCBC786A2F6CF0810EA0B2E0BF0B4CC51CAC7D06198C8861DC1516B3A36D813A257C9F1FE22D6A83B8ACB1FD7AFA83F084B509E4746DE8682CA7D10E3B498FB9E3C853EFEE298FB9E3C853EFEE215D8BEE34E43E5C0GJ1Z1fQ==
    Host: bj.5i5j.com
    Sec-Fetch-Dest: document
    Sec-Fetch-Mode: navigate
    Sec-Fetch-Site: none
    Upgrade-Insecure-Requests: 1
    User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36
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
        headers,
        // headers: { "Content-Type": "application/x-www-form-urlencoded" },
        url: url,
        // data: Qs.stringify(param)
        // params
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
        if(detailUrl && !detailUrl.includes('http')){
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
        if (imgSrc && !imgSrc.includes('http')){
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

module.exports =  { getMyHomeApiData, getDataFromHtml} 
