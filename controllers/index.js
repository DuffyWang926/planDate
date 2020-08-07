const model = require('../model');
const fs = require('fs');
const cityArr = require('./chinese_cities')

var fn_index = async (ctx, next) => {
    ctx.render('index.html', {
        title: 'Welcome'
    });
}

var fn_signin = async (ctx, next) => {
    var
        email = ctx.request.body.email || '',
        password = ctx.request.body.password || '';
        
    if (email === 'admin@example.com' && password === '123456') {
        // 登录成功:
        ctx.render('signin-ok.html', {
            title: 'Sign In OK',
            name: 'Mr Node'
        });
    } else {
        // 登录失败:
        ctx.render('signin-failed.html', {
            title: 'Sign In Failed'
        });
    }
}

let fn_logIn = async (ctx, next) => {
    let name = ctx.request.body.userName || '',
        password = ctx.request.body.userPassword || '';
    let User = model.User;
    let user = await User.findAll({
        where: {
            name
        }
    });
    
    console.log('find: ' + JSON.stringify(user));

    if (user.length > 0) {
        ctx.response.body= {
            name:'wefRoot'
        }
    } else {
        ctx.response.body= {
            msg:'用户不存在'
        }
    }
}

let test = async (ctx, next) => {
    const { data } = ctx.request.body
    console.log(data,'data')
    let buf = Buffer.from(data,'binary')
    
    let bufBasse = buf.toString('base64')
    fs.writeFile("./hello.jpeg",buf,function(err){
        if(!err){
            console.log("文件写入成功");
        }
    } );
    ctx.response.body= {
        data:bufBasse
    }

    
}

let city_init = async (ctx, next) => {
    let name = ctx.request.body.userName || '',
        password = ctx.request.body.userPassword || '';


    let City = model.City;

    // stream = fs.createReadStream(__dirname + '/chinese_cities.json'),
    // data = "";
    // stream.on('data',function(params){
    //     console.log(params, 'params');
    //     // console.log(params.toString());
    //     data += params;
    // });
    // stream.on('end',function(){
    //     // console.log(data);
    //     // console.log(data.toString());
    //     // console.log('finished!!!!');
    //     console.log( data,'data type')
    //     let arrInit = Array.from(data)

    // let test = arrInit

        
    // });
    

    
    let arr = []
    let pid = ''

    let flatObj = (test,arr,pid) =>{
        let objCopy = (k,arr,nextArr,pid) =>{
            let res = {}
            for(let o in k){
                
                if(!k[pid]){
                    if(!pid){
                        res.pid = '0'
                    }else{
                        res.pid = pid
                    }

                }
                if(Array.isArray(k[o])){
                    nextArr = k[o]
                    pid = k.no
                }else{
                    res[o] = k[o]
                }
            }
            arr.push(res)
            let result = {
                arr,
                nextArr,
                pid
            }
            return result
        }
        for(let m in test){
            let nextArr = []
            let k = test[m]
            let result =  objCopy(k,arr,nextArr,pid)
            
            if(result.nextArr.length > 0){
                flatObj(result.nextArr,arr,result.pid)
            }else{
                if(m == (test.length -1)){
                    return arr
                }
            }

        }
    }
    flatObj(cityArr, arr, pid)
    console.log(arr[0],'arr[0]')

    for(let k in arr){
        await City.findOrCreate({
            where: {
                id: arr[k].no,
                name:arr[k].name,
                pid:arr[k].pid,
            },
        });

    }
    let city = ''
    
    
    
    console.log('find: ' + JSON.stringify(city));
    
    if (city.length > 0) {
        ctx.response.body= {
            name:'wefRoot'
        }
    } else {
        ctx.response.body= {
            msg:'用户不存在'
        }
    }
}
module.exports = {
    'GET /': fn_index,
    'GET /cityInit': city_init,
    'POST /signin': fn_signin,
    'POST /logIn': fn_logIn,
    'POST /test': test,
};