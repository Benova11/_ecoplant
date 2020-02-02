const express = require('express');
const router = express.Router();

const ruleController = require('../controllers/rule');

router.get('/rule/:id', ruleController.getRule);

router.post('/rule', ruleController.createRule);

router.put('/rule/:id', ruleController.updateRule);

router.delete('/rule/:id', ruleController.deleteRule);

router.get('/rule/:id/eval', ruleController.evalRule);

module.exports = router;
