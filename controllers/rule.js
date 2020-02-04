const db = require('../data/db');
const collection = 'rule_collection';
const evaluation = { results: [] };

exports.createRule = (req, res, next) => {
  const rule = { formula: req.body.rule };
  if (!rule.contains('{') || !rule.contains('}') || !rule) {
    throw Error;
  }
  db.getDB()
    .collection(collection)
    .insertOne(rule, (err, result) => {
      if (err) {
        console.log('couldnt create rule');
      } else {
        res.json(result + 'CREATED');
      }
    });
};

exports.getRule = (req, res, next) => {
  db.getDB()
    .collection(collection)
    .findOne(
      { _id: db.getPrimaryKey(req.params.id) },
      { projection: { _id: 0, formula: 1 } },
      (err, rule) => {
        if (err) {
          console.log('cant find rule');
        } else {
          res.json(rule);
        }
      }
    );
};

exports.updateRule = (req, res, next) => {
  const rule = { formula: req.body.rule };
  db.getDB()
    .collection(collection)
    .updateOne(
      { _id: db.getPrimaryKey(req.params.id) },
      rule,
      (err, result) => {
        if (err) {
          console.log('couldnt update rule');
        } else {
          res.json(result + 'UPDATED');
        }
      }
    );
};

exports.deleteRule = (req, res, next) => {
  db.getDB()
    .collection(collection)
    .deleteOne({ _id: db.getPrimaryKey(req.params.id) }, (err, result) => {
      if (err) {
        console.log('couldnt remove rule');
      } else {
        res.json(result + 'DELETED');
      }
    });
};
//should delete last masuure
exports.checkRule = (req, res, next) => {
  db.getDB()
    .collection(collection)
    .findOne(
      { _id: db.getPrimaryKey(req.params.id) },
      { projection: { _id: 0, formula: 1 } },
      function(err, rule) {
        if (err) {
          console.log('couldnt find rule');
        }
        const triCondition = rule.formula.includes('and') ? 'and' : null;
        const isBinary = rule.formula.includes('or') ? 'or' : triCondition;
        adjustedRule = isBinary
          ? rule.formula.split(' ' + isBinary + ' ')
          : rule;
        evaluate(adjustedRule, isBinary, res);
      }
    );
};

const evaluate = (rule, isBinary, res) => {
  /*
  if (rule.length === 2) {
    switch (isBinary) {
      case 'or':
        return;

      case 'and':
        return;
    }
  }
  */
  console.log(rule);
  rule.map(ruleFrame => {
    let ruleToEval = ruleFrame.split(' ');
    const type = ruleFrame
      .split('{')
      .pop()
      .split('}')[0];
    ruleToEval[0] = type;

    db.getDB()
      .collection('ds_collection')
      .findOne({ sampleType: ruleToEval[0] }, (err, sample) => {
        if (err) {
          console.log('couldnt find sample');
        }
        ruleToEval[0] = sample.value;
        console.log(
          Function(
            '"use strict";return (' +
              ruleToEval.toString().replace(/,/g, ' ') +
              ')'
          )()
        );
        Function(
          '"use strict";return (' +
            ruleToEval.toString().replace(/,/g, ' ') +
            ')'
        );
      });
  });
};
