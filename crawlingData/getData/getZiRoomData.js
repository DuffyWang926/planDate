const puppeteer = require('puppeteer')
const chalk = require('chalk')
const { getDataFromHtml } = require('../getApiData/getZiRoomApiData') 
const log = console.log
const devices = require('puppeteer/DeviceDescriptors');
const device = devices["iPhone 6"]
const path = require('path');
const pathToExtension = path.join(__dirname, './chrome-mac/Chromium.app/Contents/MacOS/Chromium');
let getZiRoomData = async (key) =>{
    let result = {}
    const viewport =  {
        width: 1300,
        height: 900
    }
    const conf = {
      headless: false,
      // executablePath: pathToExtension,
      // defaultViewport: {
      //     width: 1300,
      //     height: 900
      // },
      // ignoreDefaultArgs:["--enable-automation"],
      ua:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
      // device,
      viewport
    }

    const browser = await puppeteer.launch(conf)
    let url = 'https://passport.futuhk.com/login#login'
    let resultFirst = []
    let resultOther = []
    try {
      const page = await browser.newPage()
      await page.setViewport(conf.viewport);
      await page.setUserAgent(conf.ua);
      // await page.emulate(conf.device);
      

      await page.evaluateOnNewDocument( () => {
          Object.defineProperty(navigator, "webdriver", {get: () => false})
      })
      await page.goto(url)
      log(chalk.yellow('ziRoom页面初次加载完毕'))
      const html = await page.content();
      resultFirst = getDataFromHtml(html)
      let logInForm = await page.$$('.ui-input-wrapper')
      let logInNode = logInForm[1]
      await logInNode.$eval('input', node => node.value='17994525' )
      let logInPWDNode = logInForm[2]
      await logInPWDNode.$eval('input', node => node.value='Wef1991926' )
      let logInClickNode = await page.$('.ui-form-submit')
      logInClickNode.click()

      await page.waitFor(1000)
      await page.waitForSelector('.nav-item-user')
      let logInCount = await page.$('.nav-item-user >a')
      logInCount.click()

      await page.waitFor(1000)
      await page.waitForSelector('.sideNav')
      let leftNav = page.waitForSelector('.sideNav')
      let leftList = await page.$$('.sideNav .nav-item >a')
      let stockNav = leftList[2]
      stockNav.click()
      // let stockList = await page.$('.sideNav .active .js-subNav >ul >li >a')
      // stockList.click()
      await page.waitFor(1000)

      let newStock = await page.$x('//a[text()="新股认购"]')
      // await page.$eval('link[rel=preload]', el => el.href);

      newStock[0].click()



      
      

      // let sumList = await page.$('.Z_pages > a')
      // let sumLen = sumList && sumList.length 
      // let sumText = ''
      // let len = 0
      // if( sumLen > 5){
      //   sumText = await sumPage.$eval('a:nth-of-type(4)', el => el.textContent)
      //   len = +sumText - 1
      // }else{
      //   len = sumLen - 2
      // }
      
      // for(let i = 0;i < (len -2); i++){
      //   let nextNode = await page.$x('//a[text()="下一页"]')
      //   nextNode[0].click()
      //   await page.waitFor(1000)
      //   // await page.waitForSelector('.Z_list > .Z_list-box > .item')
      //   const html = await page.content();
      //   let temp = getDataFromHtml(html)
      //   resultOther = resultOther.concat(temp)
      // }

  
    } catch (error) {
      // 出现任何错误，打印错误消息并且关闭浏览器
      console.log(error)
      log(chalk.red('服务意外终止'))
      // await browser.close()
    } finally {
      // 最后要退出进程
      // await browser.close()
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