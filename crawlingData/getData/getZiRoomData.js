const puppeteer = require('puppeteer')
const chalk = require('chalk')
const { getDataFromHtml } = require('../getApiData/getZiRoomApiData') 
const log = console.log
let getZiRoomData = async (key) =>{
    let result = {}
    const browser = await puppeteer.launch()
    let url = 'http://www.ziroom.com/z/?qwd=' + key
    let resultFirst = []
    let resultOther = []
    try {
      const page = await browser.newPage()
      await page.goto(url)
      log(chalk.yellow('页面初次加载完毕'))
      const html = await page.content();
      resultFirst = getDataFromHtml(html)
      let sumPage = await page.$('.Z_pages')
      let sumText = await sumPage.$eval('a:nth-of-type(4)', el => el.textContent)
      let len = +sumText
      if (len > 2){
        for(let i = 0;i < (len -2); i++){
          let nextNode = await page.$x('//a[text()="下一页"]')
          nextNode[0].click()
          await page.waitFor(1000)
          // await page.waitForSelector('.Z_list > .Z_list-box > .item')
          const html = await page.content();
          let temp = getDataFromHtml(html)
          resultOther = resultOther.concat(temp)
        }

      }
  
    } catch (error) {
      // 出现任何错误，打印错误消息并且关闭浏览器
      console.log(error)
      log(chalk.red('服务意外终止'))
      await browser.close()
    } finally {
      // 最后要退出进程
      await browser.close()
      log(chalk.green('服务正常结束'))
      // process.exit(0)
    }
    result ={
      resultFirst,
      resultOther
    }

    return result
}
async function handleData(page) {
  const list = await page.evaluate(() => {
    const writeDataList = []
    let itemList = document.querySelectorAll('.item.J_MouserOnverReq')
    for (let item of itemList) {
      let writeData = {
        picture: undefined,
        link: undefined,
        title: undefined,
        price: undefined
      }
      let img = item.querySelector('img')
      writeData.picture = img.src
      let link = item.querySelector('.pic-link.J_ClickStat.J_ItemPicA')
      writeData.link = link.href
      let price = item.querySelector('strong')
      writeData.price = ~~price.innerText
      let title = item.querySelector('.title>a')
      writeData.title = title.innerText

      writeDataList.push(writeData)
    }
    return writeDataList
    
  })
  log(chalk.yellow('写入数据库完毕'))
}

module.exports = getZiRoomData