const db = require('../data/db');
const collection = 'rule_collection';

exports.createRule = (req, res, next) => {
  const rule = { formula: req.body.rule };
  try {
    if (!rule.contains('{') || !rule.contains('}') || !rule) {
      throw new Error('input isnt correct');
    }
    db.getDB()
      .collection(collection)
      .insertOne(rule, (err, result) => {
        if (err) {
          throw new Error('something went wrong....');
        } else {
          res.json(result + 'CREATED');
        }
      });
  } catch (err) {
    console.error(err);
  }
};

exports.getRule = (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new Error('please specify rule id');
    }
    db.getDB()
      .collection(collection)
      .findOne(
        { _id: db.getPrimaryKey(req.params.id) },
        { projection: { _id: 0, formula: 1 } },
        (err, rule) => {
          if (err) {
            throw new Error('something went wrong....');
          } else {
            res.json(rule);
          }
        }
      );
  } catch (err) {
    console.error(err);
  }
};

exports.updateRule = (req, res, next) => {
  const rule = { formula: req.body.rule };
  try {
    if (!rule) {
      throw new Error('please specify rule');
    }
    db.getDB()
      .collection(collection)
      .updateOne(
        { _id: db.getPrimaryKey(req.params.id) },
        rule,
        (err, result) => {
          if (err) {
            throw new Error('something went wrong....');
          } else {
            res.json(result + 'UPDATED');
          }
        }
      );
  } catch (err) {
    console.error(err);
  }
};

exports.deleteRule = (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new Error('please specify rule id');
    }
    db.getDB()
      .collection(collection)
      .deleteOne({ _id: db.getPrimaryKey(req.params.id) }, (err, result) => {
        if (err) {
          throw new Error('something went wrong....');
        } else {
          res.json(result + 'DELETED');
        }
      });
  } catch (err) {
    console.error(err);
  }
};

exports.checkRule = (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new Error('please specify rule id');
    }
    db.getDB()
      .collection(collection)
      .findOne(
        { _id: db.getPrimaryKey(req.params.id) },
        { projection: { _id: 0, formula: 1 } },
        function(err, rule) {
          if (err) {
            throw new Error('something went wrong...');
          }
          //check if formula constructed with one or 2 conditions
          const triCondition = rule.formula.includes('and') ? 'and' : null;
          const isBinary = rule.formula.includes('or') ? 'or' : triCondition;
          adjustedRule = isBinary
            ? rule.formula.split(' ' + isBinary + ' ')
            : rule.formula;
          evaluate(adjustedRule, isBinary, res);
        }
      );
  } catch (err) {
    console.error(err);
  }
};

evaluate = (rule, isBinary, res) => {
  const rulesObj = getRuleAsObj(rule);
  let queryObj = {};
  if (rulesObj.constructor === Array) {
    if (rulesObj > 2) {
      throw new Error('something wen wrong;');
    }
    let triQuery = [
      {
        sampleType: rulesObj[0].type,
        value: adjustOperatorToQuery(rulesObj[0])
      },
      {
        sampleType: rulesObj[1].type,
        value: adjustOperatorToQuery(rulesObj[1])
      }
    ];
    switch (isBinary) {
      case 'or': {
        queryObj = {
          $or: triQuery
        };
        break;
      }
      case 'and': {
        queryObj = {
          $and: triQuery
        };
        break;
      }
    }
  } else {
    queryObj = {
      sampleType: rulesObj.type,
      value: adjustOperatorToQuery(rulesObj)
    };
  }
  try {
    db.getDB()
      .collection('ds_collection')
      .find(queryObj)
      .toArray((err, sample) => {
        if (err) {
          throw new Error('something went wrong...');
        }
        res.send(sample[0] !== undefined);
      });
  } catch (err) {
    console.error(err);
  }
};
//adjust rule structure for next actions
getRuleAsObj = rule => {
  let objArr;
  if (rule.constructor === Array) {
    objArr = rule.map(ruleFrame => {
      let ruleToEvalObj = extractType(ruleFrame);
      return ruleToEvalObj;
    });
  } else {
    objArr = extractType(rule);
  }
  return objArr;
};

extractType = rule => {
  let extracted = rule.split(' ');
  const type = rule
    .split('{')
    .pop()
    .split('}')[0];
  let obj = { type: type, operator: extracted[1], value: extracted[2] };
  return obj;
};

adjustOperatorToQuery = rule => {
  switch (rule.operator) {
    case '<': {
      return { $lt: +rule.value };
    }
    case '>': {
      return { $gt: +rule.value };
    }
    case '===': {
      return { $eq: +rule.value };
    }
    default: {
      return { $in: +rule.value };
    }
  }
};
