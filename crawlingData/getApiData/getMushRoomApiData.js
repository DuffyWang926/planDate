const https = require('https');
const axios = require("axios");
const cheerio = require('cheerio');
const { slice } = require('lodash');
const urlencode = require('urlencode');

let getMushRoomApiData = async (key) =>{
    let result = []
    let urlInit = key 
    let urlEnd = urlencode(urlInit)
    
    let url = 'http://bj.mgzf.com/list/pg1/searchWord'+ urlEnd
    let headersText = `
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8
Cache-Control: max-age=0
Connection: keep-alive
Cookie: UM_distinctid=1743e31153bc2d-09784be562fe54-31647305-13c680-1743e31153cb2e; CNZZDATA1253147438=472272899-1598768697-http%253A%252F%252Fbj.mgzf.com%252F%7C1598768697; gr_user_id=ffc944d6-3b1e-48db-93b8-8b06088a81f7; aca7dc2ea0f02f49_gr_session_id=04cbd0ce-a2fc-457a-aee7-4606312b9b78; grwng_uid=6d76ae6a-aada-42a8-bf41-5085c0d5d25f; aca7dc2ea0f02f49_gr_session_id_04cbd0ce-a2fc-457a-aee7-4606312b9b78=true; JSESSIONID=5cb86285-29a3-4f66-ba60-42b6b9a57d0f; SESSION=5cb86285-29a3-4f66-ba60-42b6b9a57d0f; acw_tc=76b20f4515987732574198107eb121dc72dc5abba0e24402b0b86cfd9c38be; acw_sc__v2=5f4b58096d5b5980bdf3ed7dda0b03de7474844b
Host: bj.mgzf.com
If-None-Match: "64b6d-+wF/UhmI51KZ3epwkvVKYNPNbtI"
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
        searchWord:key
    }
    let response = await axios({
        method: "GET",
        headers,
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
    let items = $('div.small-container > a')
    items.each((i,e) =>{
        let item = cheerio.load(e)
        let detailUrl = e.attribs.href
        let title = e.attribs.title
        let img = item('div.image-box > img')
        let imgSrc = img.attr('src')
        let middleDiv = item('div.text-content-middle > h2:nth-of-type(1)')
        let areaDiv = middleDiv.text()
        let area = areaDiv.split('-').slice(-1)[0].replace('㎡','')
        let distance = item('div.text-content-middle > p').text()
        let tagDivList = item('div.iconList > img')
        tagList = []
        tagDivList.each((key,val) =>{
            let title = val.attribs.title
            tagList.push(title)
        })
        let price = item('p.price > span').text()
        
        

        let res = { 
            imgSrc:imgSrc,
            title:title,
            area:area,
            floor:0,
            floorTotal:0,
            distance:distance,
            price,
            tagList:[],
            detailUrl:detailUrl
        }
        
        result.push(res)
    })
    return result
}

module.exports =  { getMushRoomApiData, getDataFromHtml} 
