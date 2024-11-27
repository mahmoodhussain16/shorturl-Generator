const express=require('express');
const app=express()

const urlRoute=require('./routes/url')
const path=require('path')

const port=8006
const {connectToMongoDb}=require('./connect')
const staticRoute=require('./routes/staticRouter')
const userRoute=require('./routes/user')
connectToMongoDb('mongodb://127.0.0.1:27017/short-url').then(()=>console.log('MongoDb connected'))  

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/url',urlRoute)
app.use('/', staticRoute)
app.use('/user',userRoute)
router.post('login',(req,res)=>{

    //save session
    const sessionKey=Date.now();
    session[sessionKey]=user.email
    res.cookie('session_id',sessionKey)
    return res.status(200).json(user)
})
router.use((req,res,next)=>{
    const sessionKey=req.cookies.session_id;
    if(!sessionKey){
        return res.status(401).json({message:"Unauthorized"})
    }
})
const user=db.users.find((user)=>user.email===session)
req.user=user

next()


app.listen(port,()=>console.log(`Server started at port ${port}`))