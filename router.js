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

//create a post
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

//add comment for a specific post
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
})

//get request for posts
router.get('/', (req, res) => {
  db.find()
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => res.status(500).json({ error: "The posts information could not be retrieved."}))
})

router.get('/:id', (req, res) => {
  db.findById(req.params.id)
  .then(post => {
    if (!post){
      res.status(404).json({ message: "The post with the specified ID was not found"})
    } else {
      res.status(200).json(post)
    }
  })
  .catch(err => res.status(500).json({ error: "The posts information could not be retrieved."}))
})

router.get('/:id/comments', (req, res) => {
  db.findById(req.params.id)
  .then(post => {
    if(!post){
      res.status(404).json({ message: "The post with the specified ID does not exist."})
    } else {
      db.findCommentById(req.params.id)
      .then(comments => {
        res.status(200).json(comments)
      })
      .catch(err => {
        res.status(500).json({
          message: "The comments information could not be retrieved."
        })
      })
    }
  })
})

router.delete('/:id', (req, res) => {
  let deletedPost; 
  db.findById(req.params.id)
  .then(post => {
    deletedPost = post
    console.log(deletedPost)
  })
  db.remove(req.params.id)
  .then(item => {
    console.log(item)
    res.json(deletedPost)
  }) 
})




module.exports = router