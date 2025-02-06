const express = require('express');
const tourController = require('../controller/tourController');
const authController = require('../controller/authController');
const reviewController = require('./../controller/reviewController');


const routes = express.Router();

routes.get('/top-tours', tourController.aliasTopTours, tourController.getAllTours);

routes.get('/tour-status', tourController.getTourStatus);

routes.get('/', authController.protectRoutes, tourController.getAllTours); // get all tours
routes.post('/', authController.protectRoutes, authController.restrictUserRoles('admin', 'leade-guid'), tourController.addTour); // add a tour
routes.delete('/', authController.protectRoutes, tourController.allToursDelete); // delete all tours
routes.get('/:id', authController.protectRoutes, tourController.getTour); // get tour by ID
routes.patch('/:id', authController.protectRoutes, authController.restrictUserRoles('admin', 'leade-guid'), tourController.updateTour); // update tour by ID
routes.delete('/:id', authController.protectRoutes, authController.restrictUserRoles('admin', 'leade-guid'), tourController.deleteTour); // delete a tour bby ID

routes.post('/:tourId/reviews', authController.protectRoutes, reviewController.createReviews);

module.exports = routes;