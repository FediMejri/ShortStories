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

router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Story.findOne({_id:req.params.id}).then(story=>{
        res.render('stories/edit',{
            story:story
        })
    })
})

router.get('/delete/:id',(req,res)=>{
    const id = req.params.id
    Story.remove({_id:id}).then(
        Story.find().then(stories=>{
            res.render('index/dashboard',{
                stories: stories
            })
        })
    )
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

router.post('/:id',(req,res)=>{
    let allowComments
    const id=req.params.id
    const newStory = {
        title:req.body.title,
        body:req.body.body,
        status:req.body.status,
        allowComments:allowComments,
        user : req.user.id
    }
    new Story(newStory).save()
    .then(story=>{
        res.redirect('/dashboard')
    })
    Story.deleteOne({_id:id}).then(
      console.log("deleted")
    ).catch(err=>{
    res.json({error:err})
    })
})

router.get('/show/:id',(req,res)=>{
    Story.findOne({_id:req.params.id}).populate('user')
    .then(story=>{
        res.render('stories/show',{
            story:story
        })
    })
})

module.exports=router