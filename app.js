const express = require('express')
const mongoose = require('mongoose')
const path=require('path')
const cookieParser= require('cookie-parser')
const session = require('express-session')
const auth=require('./routes/auth')
const index=require('./routes/index')
const stories=require('./routes/stories')
const Handlebars = require('handlebars')
const exphbs=require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const passport=require('passport')
const bodyParser = require('body-parser')
const keys = require('./config/keys')
require('./models/User')
require('./models/Story')

require('./config/passport')(passport)

const {
    truncate,
    formatDate,
    select
} = require('./helpers/hbs')

mongoose.Promise=global.Promise
mongoose.connect(keys.mongoURI,{
    useNewUrlParser: true 
})
.then(()=>{console.log('database connected')})
.catch(err=>{
    console.log(err)
})

const app= express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.engine('handlebars', exphbs({
    helpers:{
        truncate : truncate,
        formatDate: formatDate,
        select : select 
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))

//app.engine('handlebars',exphbs({
//    defaultLayout:'main'
//}))
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

app.use(express.static(path.join(__dirname,'public')))

app.use('/',index)
app.use('/auth',auth)
app.use('/stories',stories)

const port=process.env.PORT || 5001

app.listen(port,()=>{
    console.log('Server started on port number' + port)
})
