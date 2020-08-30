const puppeteer = require('puppeteer')
const chalk = require('chalk')
const { getMushRoomApiData } = require('../getApiData/getMushRoomApiData') 

const log = console.log
let getMushRoomData = async (key) =>{
    let result = []
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
      // viewport
    }
    const browser = await puppeteer.launch(conf)
    let url = 'http://bj.mgzf.com/list/?searchWord' +  key
    let resultFirstMush = []
    let resultOtherMush = []
    try {
      const page = await browser.newPage()
      await page.goto(url)
      log(chalk.yellow('mushRoom 页面初次加载完毕'))
      const html = await page.content();
      resultFirstMush = getDataFromHtml(html)

      let sumList = await page.$$('.pageBox > .pageSty > a')
      let sumLen = sumList && sumList.length
      if( sumLen > 3){
        let nextNode = await page.$('.cPage')
        while(nextNode){
          nextNode.click()
          await page.waitFor(1000)
          nextNode = await page.$('.cPage')
          const html = await page.content();
          let temp = getDataFromHtml(html)
          resultOtherMush = resultOtherMush.concat(temp)
        }

      }

      
        

    //   let sumPage = await page.$('.pageSty')
    //   let sumList = await page.$$('.pageSty > a')
    //   let sumLen = sumList && sumList.length
    //   let sumText = ''
    //   let len = 0
    //   if( sumLen > 3){
    //     sumText = await sumPage.$eval('a:nth-of-type(4)', el => el.textContent)
    //     len = +sumText -1
    //   }else{
    //     len = sumLen - 2
    //   }
    //   for(let i = 0;i < len; i++){
        
    //   }
      
    log(chalk.green('服务正常结束'))
    

  
    } catch (error) {
      // 出现任何错误，打印错误消息并且关闭浏览器
      console.log(error)
      log(chalk.red('服务意外终止'))
      await browser.close()
    } finally {
      // 最后要退出进程
      await browser.close()
      
      // process.exit(0)
    }
    result ={
      resultFirstMush,
      resultOtherMush
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


module.exports = getMushRoomData