const db = require('../data/db');

exports.createRule = (req, res, next) => {
  const rule = { formula: req.body.rule };
  db.getDB()
    .collection('rule_collection')
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
    .collection('rule_collection')
    .find(
      { _id: db.getPrimaryKey(req.params.id) },
      { projection: { _id: 0, formula: 1 } }
    )
    .toArray((err, rule) => {
      if (err) {
        console.log('cant find rule');
      } else {
        res.json(rule);
      }
    });
};

exports.updateRule = (req, res, next) => {
  const rule = req.body.rule;
  db.getDB()
    .collection('rule_collection')
    .updateOne(
      { _id: db.getPrimaryKey(req.params.id) },
      rule,
      (err, result) => {
        if (err) {
          console.log('couldnt update rule');
        } else {
          res.send(result + 'UPDATED');
        }
      }
    );
};

exports.deleteRule = (req, res, next) => {
  db.getDB()
    .collection('rule_collection')
    .deleteOne({ _id: db.getPrimaryKey(req.params.id) }, (err, result) => {
      if (err) {
        console.log('couldnt remove rule');
      } else {
        res.send(result + 'DELETED');
      }
    });
};
//should delete last masuure
exports.checkRule = (req, res, next) => {
  db.getDB()
    .collection('rule_collection')
    .findOne(
      { _id: db.getPrimaryKey(req.params.id) },
      { projection: { _id: 0, formula: 1 } },
      function(err, rule) {
        if (err) {
          console.log('couldnt find rule');
        }
        const triCondition = rule.formula.includes('and') ? 'and' : null;
        const isBinary = rule.formula.includes('or') ? 'or' : triCondition;
        adjustedRule = isBinary ? rule.formula.replace(isBinary, '#') : rule;
        res.send(evaluate(adjustedRule));
      }
    );
};

const evaluate = rule => {
  let evalArr = rule.split(' # ').map(ruleFrame => {
    let ruleToEval = ruleFrame.split(' ');
    const type = ruleFrame
      .split('{')
      .pop()
      .split('}')[0];
    ruleToEval[0] = type;

    db.getDB()
      .collection('ds_collection')
      .find({ sampleType: ruleToEval[0] })
      .toArray((err, sample) => {
        if (err) {
          console.log('couldnt find sample');
        }
        console.log(ruleToEval);
        ruleToEval[0] = sample[0].value;
        console.log(ruleToEval.toString().replace(/,/g, ' '));
        eval(ruleToEval.toString().replace(/,/g, ' '));
      });
  });
  return evalArr;
};
