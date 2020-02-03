const express = require('express');
const router = express.Router();

const ruleController = require('../controllers/rule');

router.get('/:id', ruleController.getRule);

router.post('', ruleController.createRule);

router.put('/:id', ruleController.updateRule);

router.delete('/:id', ruleController.deleteRule);

router.get('/:id/eval', ruleController.checkRule);

module.exports = router;
