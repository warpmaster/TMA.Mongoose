const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const mongoose = require("mongoose");
const errorHelper = require("../config/errorHelper");
const User = require("../models/user");

router.post('/', userController.createUser);
router.put('/:userId', validateId, userController.updateUser);
router.delete('/:userId', validateId, userController.deleteUser);
router.get('/:userId', validateId, userController.getUser);
router.get('/:userId/articles', validateId, userController.getUserArticles);

async function validateId(req, res, next) {
    const userId = req.params.userId;

    if (!mongoose.isValidObjectId(userId)) {
        return next(errorHelper.badRequest('user.bad_userId'));
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
        return next(errorHelper.badRequest('user.not_exists'));
    }

    req.user = user;

    next();
}

module.exports = router;