const express = require('express')
const db = require('./data/db')

const router = express.Router()


/*
Blog post schema
{
  title: "The post title", // String, required
  contents: "The post contents", // String, required
  created_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
  updated_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
}

Comment schema
{
  text: "The text of the comment", // String, required
  post_id: "The id of the associated post", // Integer, required, must match the id of a post entry in the database
  created_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
  updated_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
}


*/

router.post('/', (req, res) => {
  if (!req.body.title || !req.body.contents){
    res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
  } else {
    db.insert(req.body)
    .then(id => {
      db.findById(id.id)
      .then(post => res.status(201).json(post))
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error while saving the post to the database"})
    })
  }
})

//add comment for a post
router.post('/:id/comments', (req, res) => {
  db.findById(req.params.id)
  .then(post => {
    if (!post){
      res.status(404).json({ message: "The post with the specified ID does not exist."})
    } else if (!req.body.text){
      res.status(400).json({ message: "Please provide text for the comment."})
    } else {
      db.insertComment(req.body)
      .then(comment => {
        db.findCommentById(comment.id)
        .then(comment => {
          res.status(201).json(comment)
        })
      })
      .catch(err => {
        res.status(500).json({ error: "There was an error while saving the comment to the database."})
        console.log(err)
      })
    }
  })
  .catch(err => {
    res.status(500).json({ error: "There was an error while saving the comment to the database."})
  })
})


module.exports = router