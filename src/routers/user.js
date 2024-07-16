const express = require('express')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const auth = require('../middleware/auth')

const router = new express.Router()

// helpers
const upload = multer({ 
    limits: {
        fileSize: 100000000
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
    
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const user = await User.findByIdAndDelete(id)
        console.log(user)

        if(!user) {
            return res.status(400).send()
        }
 
        res.send('Deleted Successfully')   
    
    } catch (e) {
        res.status(500).send(e)
    }
})

// fetch a single user
router.get('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id

        const user = await User.findById(_id)
    
        if(!user) {
            return res.status(404).send()
        } 
    
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
    

})

// post user profile image
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()

    if(req.user.avatar != null) {
        req.user.avatar = null
        req.user.avatarExists = false
    }

    req.user.avatar = buffer
    req.user.avatarExists = true
    await req.user.save() 

    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error })
})


module.exports = router