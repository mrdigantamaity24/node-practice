const express = require('express');
const userController = require(`./../controller/userController`);
const authController = require('./../controller/authController');
const upload = require('./../utils/upload');

const routes = express.Router();

routes.post('/signup', upload.single('photo'), authController.signUpUserAuth); // signup route
routes.post('/signin', authController.userSignInAuth); // signin route
routes.post('/forgetpassword', authController.forgetPassword); // forgetpassword route
routes.patch('/resetpass/:token', authController.resetPassword); // reset password route
routes.delete('/deleteMe/:id', userController.deleteUserById); // delete user data by id

routes.use(authController.protectRoutes);
routes.get('/', authController.restrictUserRoles('admin'), userController.getAllUsers);   // get all users
routes.get('/me', userController.getMe, userController.getUser);    // get user by id
routes.patch('/updatepassword', authController.passwordUpdate); // update password route
routes.patch('/updateMe/', userController.updateUserData);   // update user data
routes.delete('/deleteMe', userController.deleteUserData); // delete user data
// routes.get('/getuser/:id', userController.getUser); // get single user by id

module.exports = routes;