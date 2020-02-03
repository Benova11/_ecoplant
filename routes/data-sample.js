const express = require('express');
const dataSampleController = require('../controllers/data-sample');

const router = express.Router();

router.get('/:id', dataSampleController.getSample);

router.post('', dataSampleController.createSample);

router.put('/:id', dataSampleController.updateSample);

router.delete('/:id', dataSampleController.deleteSample);

module.exports = router;
