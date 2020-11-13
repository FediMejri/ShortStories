const express = require('express')
const mongoose = require('mongoose')
const cookieParser= require('cookie-parser')
const session = require('express-session')
const auth=require('./routes/auth')
const index=require('./routes/index')
const exphbs=require('express-handlebars')
const passport=require('passport')
const keys = require('./config/keys')
require('./models/User')

require('./config/passport')(passport)

mongoose.Promise=global.Promise
mongoose.connect(keys.mongoURI,{
    useNewUrlParser: true 
})
.then(()=>{console.log('database connected')})
.catch(err=>{
    console.log(err)
})

const app= express()

app.engine('handlebars',exphbs({
    defaultLayout:'main'
}))
app.set('view engine','handlebars')

app.use(cookieParser())
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use((req,res,next)=>{
    res.locals.user = req.user || null
    next()
})

app.use('/',index)
app.use('/auth',auth)

const port=process.env.PORT || 5001

app.listen(port,()=>{
    console.log('Server started on port' + port)
})