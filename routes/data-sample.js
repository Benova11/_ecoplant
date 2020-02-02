const express = require('express');
const router = express.Router();

const dataSampleController = require('../controllers/data-sample');

router.get('/data-sample/:id', dataSampleController.getSample);

router.post('/data-sample', dataSampleController.createSample);

router.put('/data-sample/:id', dataSampleController.updateSample);

router.delete('/data-sample/:id', dataSampleController.deleteSample);

module.exports = router;
