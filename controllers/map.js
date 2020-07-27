const http = require('http');
const lodash = require('lodash');
var fn_city = async (ctx, next) => {
    ctx.response.body = {
        data:['北京']
    }
};
var fn_city_region = async (ctx, next) => {
    let initData=[]
    let resData =[]
    // let callback = ()=>{
    //     console.log('call')
    //     // console.log(ctx)
    //     console.log(resData)
    //     ctx.response.body = {
    //         data:resData
    //     }
    // }
   
    // http.get({
    //         hostname: 'area.ylapi.cn',
    //         path: `/ad_area/division_de.u?uid=11135&appkey=86bb7a82bff64aab88ecb65dfb6c5a18&parentId=110100000000`,
    //         headers: {
                
    //         }
    //     },
    //         res => {
    //             res.on('data', data => {
    //                 let dataTempt = data.toString()
    //                 let tempt = JSON.parse(dataTempt)
    //                 initData = tempt.datas
    //                 lodash.forEach(initData,(v,i) =>{
                        
    //                     let res = {
    //                         region:v.areaName,
    //                         id:v.id
    //                     }
    //                     console.log(res)
    //                     resData.push(res)
    //                 })
    //                 callback()
    //             })
                
    //         }
    //     )
    ctx.response.body = {
        data:[
            { region: '东城区', id: '110101000000' },
            { region: '西城区', id: '110102000000' },
            { region: '朝阳区', id: '110105000000' },
            { region: '丰台区', id: '110106000000' },
            { region: '石景山区', id: '110107000000' },
            { region: '海淀区', id: '110108000000' },
            { region: '门头沟区', id: '110109000000' },
            { region: '房山区', id: '110111000000' },
            { region: '通州区', id: '110112000000' },
            { region: '顺义区', id: '110113000000' },
            { region: '昌平区', id: '110114000000' },
            { region: '大兴区', id: '110115000000' },
            { region: '怀柔区', id: '110116000000' },
            { region: '平谷区', id: '110117000000' },
            { region: '密云区', id: '110118000000' },
            { region: '延庆区', id: '110119000000' },
            { region: '中关村科技园区', id: '110120000000' }
          ]
    }  
    


};
module.exports = {
    'GET /city': fn_city,
    'GET /region/:city': fn_city_region,
};