const express = require('express');
const userController = require(`${__dirname}/../controller/userController`);

const routers = express.Router();

routers.route('/').get(userController.getAllUsers).post(userController.addUsers);
routers.route('/:id').get(userController.getUser).patch(userController.updateUserData).delete(userController.deleteUserData);

module.exports = routers;