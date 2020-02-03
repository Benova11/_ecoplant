const collection = 'rule_collection';

exports.createRule = (req, res, next) => {
  const rule = req.body.rule;
  db.getDB()
    .collection(collection)
    .insertOne(rule, (err, docs) => {
      if (err) {
        console.log('couldnt create rule');
        return;
      }
      res.json(rule + 'CREATED');
    });
};

exports.getRule = (req, res, next) => {
  db.inventory.find({ _id: req.params.id }, (err, docs) => {
    if (err) {
      console.log('cant find rule');
      return;
    }
    res.json(docs);
  });
};

exports.updateRule = (req, res, next) => {
  const rule = req.body.rule;
  db.getDB()
    .collection(collection)
    .updateOne({ _id: req.params.id }, rule, (err, docs) => {
      if (err) {
        console.log('couldnt update rule');
        return;
      }
    });
  res.send(rule + 'UPDATED');
};

exports.deleteRule = (req, res, next) => {
  db.inventory.deleteOne({ _id: req.params.id }, (err, docs) => {
    if (err) {
      console.log('couldnt remove rule');
      return;
    }
  });
  res.send('DELETED');
};

exports.checkRule = (req, res, next) => {
  db.inventory.find({ _id: req.params.id }).then(documents => {
    const triCondition = documents.indexOf('and') ? 'and' : null;
    const isBinary = documents.indexOf('or') ? 'or' : triCondition;
    const splitOpt = isBinary ? null : 0;
    return evaluate(documents, splitOpt);
  });
};

const evaluate = (documents, splitOpt) => {
  let result = false;
  documents.split(isBinary, splitOpt).map(formulaFrame => {
    let ruleToEval = documents.split(' ');
    const type = documents
      .split('{')
      .pop()
      .split('}')[0];
    ruleToEval[0] = type;
    db.inventory.find({ sampleType: type }).then(documents => {
      ruleToEval[0] = documents.value;
    });
    result = eval(ruleToEval.toString().replace(/,/g, ' '));
  });
  return result;
};
