const User = require('../models/user');
const Article = require('../models/article');
const _ = require('lodash');
module.exports = { createUser, updateUser, deleteUser, getUser, getUserArticles };

async function createUser(req, res, next) {
  try {
    const user = new User(req.body);
    await user.save();

    res.status(201).json(user);

  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const fields = ['firstName', 'lastName', 'role', 'numberOfArticles', 'nickname'];
    const data = _.pick(req.body, fields);
    const user = req.user;

    for (const field of fields) {
      if (data[field]) {
        user[field] = data[field];
      }
    }

    await user.save();
    res.status(200).json(user);

  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = req.user;
    const result = await Article.deleteMany({ owner : user._id });

    console.log(`Deleted ${result.deletedCount} articles of user with id:${user._id}`);

    await user.remove();

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
      const user = req.user;

      return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function getUserArticles(req, res, next) {
  try {
    const articles = await Article.find({ owner : req.user._id }).lean();

    return res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
}