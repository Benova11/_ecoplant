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

exports.checkRule = (req, res, next) => {
  const id = db.getPrimaryKey(req.params.id);
  db.getDB()
    .collection('rule_collection')
    .find({ _id: id }, { projection: { _id: 0, formula: 1 } })
    .toArray((err, rule) => {
      if (err) {
        console.log('couldnt find rule');
      } else {
        const triCondition = rule[0].formula.includes('and') ? 'and' : null;
        const isBinary = rule[0].formula.includes('or') ? 'or' : triCondition;
        adjustedRule = isBinary ? rule[0].formula.replace(isBinary, '#') : rule;

        return evaluate(adjustedRule, id);
      }
    });
};

const evaluate = (rule, id) => {
  let result = false;
  rule.split('#').map(ruleFrame => {
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
        } else {
          console.log(sample.value);
          ruleToEval[0] = sample.value;
        }
      });
    result = eval(ruleToEval.toString().replace(/,/g, ' '));
  });
  return result;
};
