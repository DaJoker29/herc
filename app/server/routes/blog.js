const { Router } = require('express');
const VError = require('verror');
const extractor = require('keyword-extractor');
const debug = require('debug')('herc-blog');
const { ENSURE_AUTH } = require('../middleware').Auth;
const { Post } = require('../models');

const router = new Router();

router.post('/blog', ENSURE_AUTH, createPost);
router.get('/blog/:slug', renderPost);

module.exports = router;

function createPost(req, res, next) {
  const { content, title, excerpt } = req.body;
  const tags = extractor.extract(content, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });
  const result = {
    content,
    title,
    excerpt,
    author: req.user.id,
    tags,
  };

  return Post.create(result)
    .then(post => {
      debug(`Post created: ${post.postID}`);
      res.redirect(`/blog/${post.postID}`);
    })
    .catch(e => next(new VError(e, 'Problem creating new post')));
}

function renderPost(req, res, next) {
  const { slug } = req.params;
  return Post.findOne({ postID: slug })
    .then(post => {
      res.render('post', { post });
    })
    .catch(e => next(new VError(e, 'Problem rendering post')));
}