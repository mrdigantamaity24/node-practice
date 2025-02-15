const express = require('express');
const tourController = require('../controller/tourController');
const authController = require('../controller/authController');
const reviewController = require('./../controller/reviewController');
const reviewRouter = require('./../routes/reviewRoute');
const { router } = require('../app');

const routes = express.Router();

routes.use('/:tourId/review', reviewRouter);

routes.get('/top-tours', tourController.aliasTopTours, tourController.getAllTours);

routes.get('/tour-status', tourController.getTourStatus);

routes.get('/', tourController.getAllTours); // get all tours
routes.get('/:id', tourController.getTour); // get tour by ID

// this is use for the protect route if the user is not logged in and check the user is admin or lead-guide or not instead of use the all below routes.it's a better practice
routes.use(authController.protectRoutes, authController.restrictUserRoles('admin', 'leade-guid'));

routes.post('/', tourController.addTour); // add a tour
routes.delete('/', tourController.allToursDelete); // delete all tours
routes.patch('/:id', tourController.updateTour); // update tour by ID
routes.delete('/:id', tourController.deleteTour); // delete a tour bby ID

module.exports = routes;