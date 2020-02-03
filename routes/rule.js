const express = require('express');
const ruleController = require('../controllers/rule');

const router = express.Router();

router.get('/:id', ruleController.getRule);

router.post('', ruleController.createRule);

router.put('/:id', ruleController.updateRule);

router.delete('/:id', ruleController.deleteRule);

router.get('/:id/eval', ruleController.checkRule);

module.exports = router;
