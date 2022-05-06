// implement your posts router here
const express = require('express');
const { find,
    findById,
    insert,
    update,
    remove,
    findPostComments,
    findCommentById,
    insertComment} = require('./posts-model');

const router = express.Router();

router.use(express.json());



router.route('/')
    .get( (req, res) => {
        find()
        .then( posts => res.status(200).json(posts))
        .catch(() => res.status(500).json({message: "The posts information could not be retrieved"}))
    })
    .post( (req, res) => {
        const {title, contents} = req.body;
        if (!title || !contents) {
            res.status(400).json({message: "Please provide title and contents for the post"})
        } else {
            insert({title, contents})
            // .then(confirm => console.log(confirm))
            .then(confirm => res.status(confirm ? 201 : 500).json(confirm ?  {...confirm, title, contents} : {message: "There was an error while saving the post to the database"}))
        }
    })

router.route('/:id')
    .get( (req, res) => {
        findById(req.params.id)
        .then( post => res.status(post ? 200 : 404).json(post ? post : {message: "The post with he specified ID does not exist"}))
        .catch(() => res.status(500).json({message: "The post information could not be retrieved"}))
    })
    .delete( (req, res) => {
        findById(req.params.id)
        .then( user => {
            if (user) {
                remove(req.params.id)
                .then( () => res.status(200).json(user))
                .catch( () => res.status(500).json({message: "The post could not be removed"}))       
            } else {
                res.status(404).json({message: "The post with the specified ID does not exist"})
            }
        })
        .catch(() => res.status(500).json({message: "The post could not be removed"}))
     
    })
    .put( (req, res) => {
        const {title, contents} = req.body;
        if (!title || !contents) {
            res.status(400).json({message: "Please provide title and contents for the post"})
        } else {
            update(req.params.id, {title, contents})
            .then( confirm => res.status(confirm ? 200 : 404).json(confirm ? {id: +req.params.id, title, contents} : {message: "The post with the specified ID does not exist"}))
            .catch(() => res.status(500).json({message: "The post information could not by modified"}))
        }
    })

    router.route('/:id/comments')
    .get( (req, res) => {
        findPostComments(req.params.id)
        .then( post => res.status(post.length ? 200 : 404).json(post.length ? post : {message: "The post with he specified ID does not exist"}))
        .catch(() => res.status(500).json({message: "The comments information could not be retrieved"}))
    })


module.exports = router;