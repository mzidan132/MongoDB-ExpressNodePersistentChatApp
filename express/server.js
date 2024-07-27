const express = require('express')//common js
//import path from 'path' //es6
const path = require('path')
const posts = require('./routes/posts.js')
const errorHandler = require('./routes/posts.js')
//const logger = require('./middleware/logger')
const port = process.env.PORT || 8000
const app = express()

//body parser middleware access to req and res object, to authenticate
app.use(express.json())
app.use(express.urlencoded({extended:false}))
//app.use(logger)
//setup static folder middle runs between incoming request upcoming respone
//app.arguments(express.static(path.join(__dirname,'public'))) //stop repeating render html code

app.get('/',(req,res)=>{
    console.log(req.query)
    res.status(200).json({message:'hello'}) //can pass html tags, stringify json automatically sent as string converted
})

app.get('/about',(req,res)=>{
    res.send('<h1>About</h1>')
})

app.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html')) //render index.html
})

app.use('/api/posts',posts)
app.use(errorHandler)
//ejs
app.set('view engine','ejs')
app.set('views','views')
app.get('/ejs',(req,res)=>{
    res.render('index',{
        title:'welcome'
    })
})
app.listen(port,()=>console.log(`server running on port 8000`)) //stop cmd by copy

