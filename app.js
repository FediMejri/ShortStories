const express = require('express')
const mongoose = require('mongoose')
const auth=require('./routes/auth')
const passport=require('passport')

require('./config/passport')(passport)

const app= express()

app.get('/',(req,res)=>{
    res.send('it works')
})

app.use('/auth',auth)

const port=process.env.PORT || 5001

app.listen(port,()=>{
    console.log('Server started on port' + port)
})