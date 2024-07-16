const express = require("express")
//const Tweet = require('./models/tweet')

const app = express()
require('dotenv').config()
var connectDB = require('./db/mongoose')
connectDB()
const userRouter = require('./routers/user')
app.use(express.json());
app.use(express.static("public"));
const port = process.env.PORT || 3000

app.use(userRouter)

app.listen(port, () => {
    console.log('Server is up on the port ' + port)
})

