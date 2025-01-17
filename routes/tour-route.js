const express = require('express');
const tourController = require(`${__dirname}/../controller/tourController`);

const routes = express.Router();

// routes.param('id', tourController.checkID);

routes.route('/').get(tourController.getAllTours).post(tourController.addTour);
routes.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = routes;