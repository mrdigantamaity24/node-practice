const express = require('express');
const userController = require(`./../controller/userController`);
const authController = require('./../controller/authController');
const upload = require('./../middleware/upload');

const routers = express.Router();

routers.get('/', userController.getAllUsers);   // get all users
routers.get('/:id', authController.protectRoutes, userController.getUser);    // get user by id
routers.post('/signup', upload.single('photo'), authController.signUpUserAuth); // signup route
routers.post('/signin', authController.userSignInAuth); // signin route
routers.post('/forgetpassword', authController.forgetPassword); // forgetpassword route
routers.patch('/resetpass/:token', authController.resetPassword); // reset password route
routers.patch('/updatepassword', authController.protectRoutes, authController.passwordUpdate); // update password route
routers.patch('/updateMe/', authController.protectRoutes, userController.updateUserData);   // update user data
routers.delete('/deleteMe', authController.protectRoutes, userController.deleteUserData); // delete user data

module.exports = routers;