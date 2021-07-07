const express = require('express');
const { validateUser, validateUserId, validatePost } = require('../middleware/middleware');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const posts = require('../posts/posts-model')
const users = require('./users-model')

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  users.get()
    .then(resp => {
      console.log(resp);
      res.status(200).json(resp);
    }).catch(() => {
      res.status(500).json({ message: "Undefined server error." })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  const { id } = req.params;

  users.getById(id)
    .then(resp => {
      res.status(200).json(resp);
    }).catch(() => {
      res.status(500).json({ message: "Undefined server error." })
    })
});

router.post('/', validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  const neoUser = req.body;

  users.insert(neoUser)
    .then((resp) => {
      res.status(201).json(resp);
    }).catch(() => {
      res.status(500).json({ message: "Undefined server error." })
    })
});

router.put('/:id', [validateUserId, validateUser], (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { id } = req.params;
  let neoUser = req.body;
      
  users.update(id, neoUser)
    .then(() => {
      users.getById(id)
        .then((record)=> {
          res.status(201).json(record);
        }).catch(() => {
          res.status(500).json({ message: "Undefined user server error." })
        })
    }).catch(() => {
      res.status(500).json({ message: "Undefined server error." })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const { id } = req.params;
  
  users.remove(id)
    .then(() => {
      res.status(200).json(req.user);
    }).catch(() => {
      res.status(500).json({ message: "Undefined delete from server error." })
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const { id } = req.params;

  posts.getByUserId(id)
    .then((resp) => {
      res.status(200).json(resp);
    }).catch(() => {
      res.status(500).json({ message: "Undefined server error." })
    })
});

router.post('/:id/posts', [validateUserId, validatePost], (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { id } = req.params;
  const post = req.body;
  post.user_id = id;
  
  posts.insert(post)
    .then((resp) => {
      res.status(201).json(resp);
    }).catch(() => {
      res.status(500).json({ message: "Undefined server error." })
    })
});

// do not forget to export the router
module.exports = router;