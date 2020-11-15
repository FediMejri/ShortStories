const express= require('express')
const router=express.Router()
const {ensureAuthenticated,ensureGuest} = require('../helpers/auth')
const mongoose = require('mongoose')
require('../models/Story')
require('../models/User')
const Story=mongoose.model('stories')
const User = mongoose.model('users')

router.get('/',(req,res)=>{
    Story.find({status:'public'}).populate('user')
    .sort({date: 'desc'})
    .then(stories=>{
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
        if(story.user!= req.user.id){
            res.redirect('/stories')
        }else{
            res.render('stories/edit',{
                story:story
            })
        }
    })
})

router.get('/delete/:id',ensureAuthenticated,(req,res)=>{
    const id = req.params.id
    Story.remove({_id:id}).exec().then(
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
        res.redirect('stories/show/'+id)
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
    Story.findOne({_id:req.params.id}).populate('user').populate('comments.commentUser')
    .then(story=>{
        if(story.status=='public'){
            res.render('stories/show',{
                story:story
            })
        }else{
            if(req.user){
                if(req.user.id==story.user._id){
                    res.render('stories/show',{
                        story:story
                    })
                }else{
                    res.redirect('/stories')
                }
            }else{
                res.redirect('/stories')
            }
        }
    })
})

router.post('/comment/:id',(req,res)=>{
    Story.findOne({_id:req.params.id})
    .then(story=>{
        const newComment={
            commentBody:req.body.commentBody,
            commentUser:req.user.id
        }
        story.comments.unshift(newComment)
        story.save()
        .then(story=>{
            res.redirect('/stories/show/'+story.id)
        })
    })
})

router.get('/my',ensureAuthenticated,(req,res)=>{
    Story.find({user:req.user.id})
    .populate('user')
    .then(stories=>{
        res.render('stories/index',{
            stories:stories
        })
    })
})

module.exports=router