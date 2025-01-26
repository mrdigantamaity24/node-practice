const express = require('express');
const userController = require(`./../controller/userController`);
const authController = require('./../controller/authController');

const routers = express.Router();

routers.get('/', userController.getAllUsers);   // get all users
routers.get('/:id', userController.getUser);    // get user by id
routers.patch('/:id', userController.updateUserData);   // update user data
routers.delete('/:id', userController.deleteUserData); // delete user data
routers.post('/signup', authController.signUpUserAuth); // signup route
routers.post('/signin', authController.userSignInAuth); // signup route
routers.post('/forgetpassword', authController.forgetPassword); // signup route
routers.patch('/resetpass/:token', authController.resetPassword); // signup route

// routers.route('/').get(userController.getAllUsers);
// routers.route('/:id').get(userController.getUser).patch(userController.updateUserData).delete(userController.deleteUserData);

module.exports = routers;