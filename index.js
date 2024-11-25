const express=require('express');
const app=express()
const urlRoute=require('./routes/url')

const port=8004
const {connectToMongoDb}=require('./connect')


connectToMongoDb('mongodb://127.0.0.1:27017/short-url').then(()=>console.log('MongoDb connected'))  
app.use(express.json())
app.use('/url',urlRoute)




app.listen(port,()=>console.log(`Server started at port ${port}`))

