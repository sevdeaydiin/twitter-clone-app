const express = require('express')
const User = require('../models/user')

const router = new express.Router()

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

router.delete('users/:id', async (req, res) => {
    try {

        const user = await User.findByIdAndDelete(req.params.id)
        
        if(!user) {
            return res.status(400).send()
        }
 
        res.send('Deleted Successfully')   
    
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router