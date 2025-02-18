const controller=require('../controllers/controller')
const router=require('express').Router()

router.post('/login',(req,res)=>{
    controller.login(req,res)
})

router.post('/fizz',(req,res)=>{
    controller.fizz(req,res)
})

module.exports=router;