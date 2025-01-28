const express = require('express');
const userController = require(`./../controller/userController`);
const authController = require('./../controller/authController');

const routers = express.Router();

routers.get('/', userController.getAllUsers);   // get all users
routers.get('/:id', userController.getUser);    // get user by id
routers.post('/signup', authController.signUpUserAuth); // signup route
routers.post('/signin', authController.userSignInAuth); // signin route
routers.post('/forgetpassword', authController.forgetPassword); // forgetpassword route
routers.patch('/resetpass/:token', authController.resetPassword); // reset password route
routers.patch('/updatepassword/:id', authController.protectRoutes, authController.passwordUpdate); // update password route
routers.patch('/updateMe/:id', authController.protectRoutes, userController.updateUserData);   // update user data
routers.delete('/deleteMe/:id', authController.protectRoutes, userController.deleteUserData); // delete user data
// routers.patch('/upadteMe/:id', authController.protectRoutes, authController.updateuserData); // update password route

// routers.route('/').get(userController.getAllUsers);
// routers.route('/:id').get(userController.getUser).patch(userController.updateUserData).delete(userController.deleteUserData);

module.exports = routers;