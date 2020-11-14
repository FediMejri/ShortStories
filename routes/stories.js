const express= require('express')
const router=express.Router()
const {ensureAuthenticated,ensureGuest} = require('../helpers/auth')
const mongoose = require('mongoose')
require('../models/Story')
require('../models/User')
const Story=mongoose.model('stories')
const User = mongoose.model('users')

router.get('/',(req,res)=>{
    Story.find({status:'public'}).populate('user').then(stories=>{
        res.render('stories/index',{
            stories:stories
        })
    })
})

router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('stories/add')
})

router.post('/',(req,res)=>{
    let allowComments
    if(req.body.allowComments){
        allowComments=true
    }else{
        allowComments=false
    }
    const newStory = {
        title : req.body.title,
        body : req.body.body,
        status : req.body.status,
        allowComments: allowComments,
        user : req.user.id
    }
    new Story(newStory)
    .save()
    .then(story=>{
        const id = story.id
        res.redirect('stories/show'+id)
    })
})

module.exports=router