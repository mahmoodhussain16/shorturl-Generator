const express=require('express');
const app=express()

const urlRoute=require('./routes/url')
const path=require('path')

const port=8006
const {connectToMongoDb}=require('./connect')
const staticRoute=require('./routes/staticRouter')

connectToMongoDb('mongodb://127.0.0.1:27017/short-url').then(()=>console.log('MongoDb connected'))  

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/url',urlRoute)
app.use('/', staticRoute)


app.listen(port,()=>console.log(`Server started at port ${port}`))