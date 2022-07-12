const express = require('express');
const router = express.Router();

const articleController = require('../controllers/article');
const mongoose = require("mongoose");
const errorHelper = require("../config/errorHelper");
const Article = require("../models/article");
const User = require("../models/user");

router.post('/',
    validateOwner,
    articleController.createArticle);

router.put('/:articleId',
    validateOwner,
    validateArticle,
    articleController.updateArticle);

router.delete('/:articleId',
    validateArticle,
    articleController.deleteArticle);

router.get('/', articleController.getArticle);

async function validateOwner(req, res, next) {

    if (req.body.owner) {
        const userId = req.body.owner;

        if (!mongoose.isValidObjectId(userId)) {
            return next(errorHelper.badRequest('user.bad_id'));
        }

        const owner = await User.findOne({ _id: userId });

        if (!owner) {
            return next(errorHelper.badRequest('user.not_exists'));
        }

        req.owner = owner;
    }

    next();
}

async function validateArticle(req, res, next) {
    const articleId = req.params.articleId;

    if (!mongoose.isValidObjectId(articleId)) {
        return next(errorHelper.badRequest('article.bad_id'));
    }

    const article = await Article.findOne({ _id: articleId });

    if (!article) {
        return next(errorHelper.badRequest('article.not_exists'));
    }

    req.article = article;

    next();
}

module.exports = router;