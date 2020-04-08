const express = require('express')
const server = express()
const postsRouter = require('./router')

server.use(express.json())
server.use('/api/posts', postsRouter) //set up router here


server.listen(5000, () => {
  console.log("Listening on port 5000")
})