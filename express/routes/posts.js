const express = require('express')
const router = express.Router()

let posts = [
    { id: 1, title: 'post1' },
    { id: 2, title: 'post2' },
    { id: 3, title: 'post3' }
]

const logger = (req,res,next)=>{ //runs at end by calling next middleware function
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    next()
}

router.get('/',logger, (req, res) => { //http://localhost:8000/api/posts/?limit=2
    const limit = parseInt(req.query.limit) //req comes from url, res comes from server
    if (!isNaN(limit) && limit > 0) {
        res.json(posts.slice(0, limit))
    }
    else {
        res.json(posts)
    }
    res.json(posts)
})

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const post = posts.find(post => post.id === id)
    if (!post) {
        res.status(404).json({ msg: `A post with id ${id} was not found` })
        //const error = new Error(`A post with id ${id} was not found`)
        //return next(error)
    }
    res.json(posts.filter(post => post.id === id)) //j id req korba url a seta match kore result dekhabe dynamically
})

//const errorHandler=(err,req,res,next)=>{
  //  res.status(404).json({msg:'err.msg'})
//}
//create post
router.post('/', (req, res) => {
    const newPost = {
        id: posts.length + 1,
        title: req.body.title
    }
    if (!newPost.title) {
        return res.status(400).json({ msg: 'pls include a title' })
    }
    posts.push(newPost)
    //console.log(req.body)
    res.status(201).json(posts)
})
//Update post
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const post = posts.find(post => post.id === id) //filter but only return the 1st matched value
    if (!post) {
        return res.status(404).json({ msg: 'could not find ur id' })
    }
    post.title = req.body.title
    res.status(200).json(posts)
})
//delete post
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const post = posts.find(post => post.id === id) //filter but only return the 1st matched value
    if (!post) {
        return res.status(404).json({ msg: 'could not find ur id' })
    }
    posts = posts.filter(post => post.id !== id)
    res.status(200).json(posts)
})


//to update auto change package.json
module.exports = router
//module.exports = errorHandler