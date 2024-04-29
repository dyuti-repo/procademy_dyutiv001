const fs = require('fs')
const readline = require('readline')
const http = require('http')
const html = fs.readFileSync('./Template/index.html','utf-8')
const url = require('url') //return us an url object










let products = JSON.parse(fs.readFileSync('./Data/products.json','utf-8'))
// console.log(products) //array
let productListHtml = fs.readFileSync('./Template/product-list.html','utf-8')
let productDetailsHtml = fs.readFileSync('./Template/product-details.html','utf-8')



function replaceHtml(template,product){
    let output = template.replace('{{%IMAGE%}}',product.productImage)
    output = output.replace('{{%NAME%}}',product.name)
    output = output.replace('{{%MODELNAME%}}',product.modelName)
    output = output.replace('{{%MODELNO%}}',product.modelNumber)
    output = output.replace('{{%SIZE%}}',product.size)
    output = output.replace('{{%CAMERA%}}',product.camera)
    output = output.replace('{{%PRICE%}}',product.price)
    output = output.replace('{{%COLOR%}}',product.color)
    output = output.replace('{{%ID%}}',product.id)
    output = output.replace('{{%ROM%}}',product.ROM)
    output = output.replace('{{%DESC%}}',product.Description)
    
    return output;
}

//LECTURE 05 ON FILE SYSTEM READING & WRITING OF FILE
/*const textIn = fs.readFileSync('./Files/input.txt','utf-8')
console.log(textIn)

let content = `Data read from input.txt ${textIn}\n Date created: ${new Date()}`
fs.writeFileSync('./Files/output.txt',content) */

/*fs.readFile('./Files/start.txt','utf-8',function(error1,data1){
    console.log(data1)
    fs.readFile(`./Files/${data1}.txt`,'utf-8',function(error2,data2){
        console.log(data2);
        fs.readFile('./Files/append.txt','utf-8',function(error3,data3){
            console.log(data3);
            fs.writeFile('./Files/output.txt',`${data2}\n\n${data3}\n\nDate created ${new Date()}`,
            function(){
                console.log('file written successfully');
            })
        })
    })
})
console.log("Reading file.......")  */

//.............
//LECTURE - 08 CREATING A SIMPLE SERVER........

//step 1 create a server
const server = http.createServer(function(request,response){
    let {query,pathname:path} = url.parse(request.url,true)
    // let x = url.parse(request.url,true)
    // console.log(x)
    //let path = request.url

    if(path === '/' || path.toLocaleLowerCase() === '/home'){
        response.writeHead(200,{
            'Content-Type':'text/html',
            'my-header':'Hello World'
        }) //this line should always be written before the response.end
        response.end(html.replace('{{%CONTENT%}}','You are in Homepage'))
    }
    else if (path.toLocaleLowerCase() === '/about'){
        response.writeHead(200,{
            'Content-Type':'text/html',
            'my-header':'ABOUT'
        }) //this line should always be written before the response.end
        response.end(html.replace('{{%CONTENT%}}','You are in about page'))
    }
    else if(path.toLocaleLowerCase() === '/contact'){
        response.writeHead(200,{
            'Content-Type':'text/html',
            'my-header':'CONTACT'
        }) //this line should always be written before the response.end
        response.end (html.replace('{{%CONTENT%}}','You are in contact page'))
    }
    else if(path.toLocaleLowerCase() === '/products'){
        if(!query.id){
            let productHtmlArray = products.map((prod) => {
                return replaceHtml(productListHtml,prod)
            })
            let productResponseHtml = html.replace('{{%CONTENT%}}',productHtmlArray.join(','))
            response.writeHead(200,{'Content-Type':'text/html','my-Header':'json-data'});
            response.end(productResponseHtml)
            //console.log(productHtmlArray.join(','))

        }
        else
        {
            let prod = products[query.id]
            let productDetailResponseHtml = replaceHtml(productDetailsHtml,prod)
            response.end(html.replace('{{%CONTENT%}}',productDetailResponseHtml))
        }
        
    }
    
    else{
        response.writeHead(404,{
            'Content-Type':'text/html',
            'my-header':'ERROR:404'
        })
        response.end(html.replace('{{%CONTENT%}}','ERROR 404 : PAGE NOT FOUND'))
    }

})
// starting of an sever
server.listen(8002,'127.0.0.1',function(){
    console.log("SERVER HAS STARTED")
})