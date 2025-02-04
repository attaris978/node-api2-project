// implement your server here
// require your posts router and connect it here
const express = require('express');
const postsRoutes = require('./posts/posts-router');

const server = express();

server.use('/api/posts', postsRoutes);

module.exports = server;