const express = require("express")
const app = express()
require('dotenv').config()
var connectDB = require('./db/mongoose')
connectDB()

const userRouter = require('./routers/user')
const tweetRouter = require('./routers/tweet')
const notificationRouter = require('./routers/notification')
app.use(express.json());
app.use(express.static("public"));

const port = process.env.PORT || 3000

app.use(userRouter)
app.use(tweetRouter)
app.use(notificationRouter)

app.listen(port, () => {
    console.log('Server is up on the port ' + port)
})
