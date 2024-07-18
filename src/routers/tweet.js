const express = require('express')
const Tweet = require('../models/tweet')
const router = new express.Router()
const auth = require('../middleware/auth')

// post tweet
router.post('/tweets', auth, async (req, res) => {
    const tweet = new Tweet({
        ...req.body,
        user: req.user._id
    })

    try {
        await tweet.save()
        res.status(201).send(tweet)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/tweets', async (req, res) => {
    try {
        const tweets = await Tweet.find({})
        res.send(tweets)
        
    } catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router