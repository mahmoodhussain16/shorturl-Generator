const express=require('express')
const router=express.Router()
const {handleUserSignUp,handleUserLogin}=require('../controllers/user')


router.post('/',handleUserSignUp)
router.post('/user/login',handleUserLogin)

module.exports=router