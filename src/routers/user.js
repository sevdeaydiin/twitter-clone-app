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

    res.send(buffer)

}, (error, req, res, next) => {
    res.status(400).send({ error: error })
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error('The user doesnt exists')
        }
    
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)

    } catch(e) {
        res.status(404).send(e)
    }
    
})

// Following
router.put('/users/:id/follow', auth, async (req, res) => {
    
    if(req.user.id != req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            if(!user.followers.includes(req.user.id)) {
                await user.updateOne({ $push: { followers: req.user.id }})
                await req.user.updateOne({ $push: { followings: req.params.id }})
                res.status(200).json('User has been followed.')
            } else {
                res.status(403).json('You already follow this user.')
            }
        } catch(e) {
            res.status(500).json(e)
        }
    } else {
        res.status(403).json('You cannot follow yourself')
    }
})

// Unfollow
router.put('/users/:id/unfollow', auth, async (req, res) => {
    
    if(req.user.id != req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            if(user.followers.includes(req.user.id)) {
                await user.updateOne({ $pull: { followers: req.user.id }})
                await req.user.updateOne({ $pull: { followings: req.param.id }})
                res.status('User has been unfollowed.')
            } else {
                res.status(403).json('This user cannot unfollow.')
            }
        } catch(e) {
            res.status(500).json(e)
        }
    } else {
        res.status(403).json('You cannot unfollow yourself')
    } 
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    console.log(updates)

    const allowedUpdates = ['name', 'email', 'password', 'website', 'bio', 'location']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send( { error: 'Invalid request!'})
    }

    try {
        const user = req.user
        console.log('user: ', user)
        console.log(req.body)
        console.log(user['name'])
        console.log(req.body['name'])
        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save()

        res.send(user)

    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router