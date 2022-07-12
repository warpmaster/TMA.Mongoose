const Article = require('../models/article');
const User = require('../models/user');
const _ = require('lodash');
const errorHelper = require("../config/errorHelper");
const mongoose = require("mongoose");
module.exports = { createArticle, updateArticle, deleteArticle, getArticle };

async function createArticle(req, res, next) {
    try {
        const article = new Article(req.body);
        await article.save();

        req.owner.numberOfArticles += 1;
        await req.owner.save();

        res.status(201).json(article);

    } catch (err) {
        next(err);
    }
}

async function updateArticle(req, res, next) {
    try {
        const fields = ['title', 'subtitle', 'owner', 'description', 'category'];
        const data = _.pick(req.body, fields);
        const article = req.article;

        if (data.owner) {
            const newOwner = req.owner;
            const oldOwner = await User.findOne({ _id: article.owner });

            newOwner.numberOfArticles += 1;
            oldOwner.numberOfArticles -= 1;

            await newOwner.save();
            await oldOwner.save();
        }

        for (const field of fields) {
            if (data[field]) {
                article[field] = data[field];
            }
        }

        await article.save();
        res.status(200).json(article);

    } catch (err) {
        next(err);
    }
}

async function deleteArticle(req, res, next) {
    try {
        const article = req.article;
        await article.remove();

        const owner = await User.findOne({ _id: article.owner });

        if (!owner) {
            return next(errorHelper.badRequest('user.not_exists'));
        }

        owner.numberOfArticles -= 1;
        await owner.save();

        res.status(200).json(article);
    } catch (err) {
        next(err);
    }
}

async function getArticle(req, res, next) {
    try {
        const {
            query: {skip = 0, limit = 10, search = '', sort: sortFromClient}
        } = req;
        const sort = util.sort(sortFromClient);
        const filter = {$regex: new RegExp(util.escapeRegExpChars(search), 'i')};

        const query = {
            $or: [
                {title: filter},
                {subtitle: filter},
                {description: filter},
                {category: filter},
            ]};

        const result = await Article.find(query)
            .populate('owner')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}
