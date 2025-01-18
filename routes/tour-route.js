const express = require('express');
const tourController = require(`${__dirname}/../controller/tourController`);

const routes = express.Router();

routes.route('/').get(tourController.getAllTours).post(tourController.addTour).delete(tourController.allToursDelete);
routes.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = routes;