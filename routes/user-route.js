const express = require('express');
const userController = require(`${__dirname}/../controller/userController`);
const authController = require('./../controller/authController');

const routers = express.Router();

routers.post('/signup', authController.signUpUserAuth); // signup route

routers.route('/').get(userController.getAllUsers);
routers.route('/:id').get(userController.getUser).patch(userController.updateUserData).delete(userController.deleteUserData);


module.exports = routers;