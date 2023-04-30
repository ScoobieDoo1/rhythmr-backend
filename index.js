const http = require('http');
const fs = require('fs');   //filesystem
const path = require('path');   //path

// importing mongodb
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://rojeshstha1:mfosBjuVFfGvOc8k@rojeshcluster.zakubth.mongodb.net/?retryWrites=true&w=majority";

 async function overwriteData(data){
    fs.writeFile('./public/assets/data.json',JSON.stringify(data),(err)=>console.log(err));
 }

 async function readAllData(client){
    const db = client.db('rhythmrdb').collection('rhythmrcollection').find({});
    let data = await db.toArray();
    await overwriteData(data);

 }
 async function connectToMongodb(){
    // console.log("hello");
    const client = new MongoClient(uri);
    try{
        client.connect();
        console.log("----Mongo Connection Successful.----");
        await readAllData(client);
        
    }catch(e){
        console.log(e);
    }finally{
        client.close();
    }
}
const server = http.createServer((req,res)=>{
    console.log(req.url);
    if(req.url==='/'){
        fs.readFile(path.join(__dirname,'public','index.html'),(err,content)=>{
            if(err) throw err;
            console.log(content);
            res.writeHead(200,{'Content-Type':'text/html'});
            res.end(content);
        })
    }else if(req.url.match('\.css$')){
        const pathCss = path.join(__dirname,'public',req.url);
        const filePath = fs.createReadStream(pathCss,'utf-8');
        res.writeHead(200,{'Content-Type':'text/css'});
        filePath.pipe(res);      

    }else if(req.url.match('\.png$')){
        const pathPng = path.join(__dirname,'public',req.url);
        const filePath = fs.createReadStream(pathPng);
        res.writeHead(200,{'Content-Type':'image/png'});
        filePath.pipe(res);      

    }else if(req.url.match('\.jpg$')){
        const pathJpg = path.join(__dirname,'public',req.url);
        const filePath = fs.createReadStream(pathJpg);
        res.writeHead(200,{'Content-Type':'image/jpg'});
        filePath.pipe(res);      

    }else if(req.url.match('\.svg$')){
        const pathSvg = path.join(__dirname,'public',req.url);
        const filePath = fs.createReadStream(pathSvg);
        res.writeHead(200,{'Content-Type':'image/svg+xml'});
        filePath.pipe(res);      

    }else if(req.url==='/api'){
        connectToMongodb();
        fs.readFile(path.join(__dirname,'public','assets/data.json'),(err,content)=>{
            if(err) throw err;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(content);
        })
        
    }
});
server.listen(5959,()=> console.log('Server is up and running'));