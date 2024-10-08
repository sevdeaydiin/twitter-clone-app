const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Tweet = require('../models/tweet')
const router = new express.Router()
const auth = require('../middleware/auth')

const upload = multer({
    limits: {
        fileSize: 100000000
    }
})

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

// add image to tweet
router.post('/uploadTweetImage/:id', auth, upload.single('upload'), async (req, res) => {

    const tweet = await Tweet.findOne({ _id: req.params.id })
    console.log(tweet)

    if(!tweet) {
        throw new Error('Cannot find the tweet')
    }

    const buffer = await sharp(req.file.buffer).resize({ width: 350, height: 350 }).png().toBuffer()
    tweet.image = buffer
    await tweet.save()
    res.send()

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// all tweet
router.get('/tweets', async (req, res) => {
    try {
        const tweets = await Tweet.find({})
        res.send(tweets)

    } catch(e) {
        res.status(500).send(e)
    }
})

// fetch a specific users tweets
router.get('/tweets/:id', async (req, res) => {

    const _id = req.params.id

    try {
        const tweets = await Tweet.find({ user: _id })
        if(!tweets) {
            return res.status(404).send()
        }
        res.send(tweets)

    } catch(e) {
        res.status(500).send(e)
    }
})

// fetch tweet image 
router.get('/tweets/:id/image', async (req, res) => {

    try {
        const tweet = await Tweet.findById(req.params.id)

        if(!tweet || !tweet.image) {
            throw new Error('Tweet image doesnt exists')
        }

        res.set('Content-Type', 'image/jpg')
        res.send(tweet.image)

    } catch(e) {
        res.status(404).send(e)
    }
})

// Like tweet
router.put('/tweets/:id/like', auth, async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id)
        if(!tweet.likes.includes(req.user.id)) {
            await tweet.updateOne({ $push: { likes: req.user.id }} )
            res.status(200).json("post has been liked")
        } else {
            res.status(403).json("you have already liked this tweet")
        }
    } catch(err) {
        res.status(500).json(err)
    }  
})

router.put('/tweets/:id/unlike', auth, async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id)
        if(tweet.likes.includes(req.user.id)) {
            await tweet.updateOne({ $pull: { likes: req.user.id }} )
            res.status(200).send("post has been unliked")
        } else {
             res.status(403).send("you have already unliked this tweet")
        }
    } catch(err) {
        res.status(500).json(err)
    }
})

module.exports = router