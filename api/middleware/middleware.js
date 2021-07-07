const db = require('../users/users-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  //request method, request url, and a timestamp
    console.log("Method: ", req.method);
    console.log("URL: ", req.url);
    console.log("Time: ", Date.now() );
  
  next();
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  const {id} = req.params;

  db.getById(id)
    .then(result => {
        if (!result || result === undefined || result === {}) {
          res.status(404).json({ message: "user not found" });
        } else {
          req.user = result;
          next();
        }
    }).catch(() => {
      res.status(500).json({ message: "Unknown server error." })
    })
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const user = req.body;

  if (!user.name) {
    res.status(400).json({ message: "missing required name" });
  } else { 
    if (!req.user) {
      req.user = user;
    }
    next();
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const post = req.body;

  if (!post.text) {
    res.status(400).json({ message: "missing required text" });
  } else { 
    req.post = post;
    next();
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUser,
  validateUserId,
  validatePost
}