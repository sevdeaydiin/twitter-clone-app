const mongoose = require("mongoose")

const tweetSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    image: {
        type: Buffer
    },
    likes: {
        type: Array,
        default: [],
    }
}, {
    timestamps: true
})

tweetSchema.methods.toJson = function() {
    const tweet = this

    const tweetObject = tweet.toObject()
    if(tweetObject.image) {
        tweetObject.image = "true"
    }
    return tweetObject
}

const Tweet = mongoose.model('Tweet', tweetSchema)
module.exports = Tweet