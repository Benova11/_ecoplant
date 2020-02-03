exports.createRule = (req, res, next) => {
  const rule = {
    sampleType: req.body.type,
    operator: req.body.operator,
    value: req.body.value
  };
  db.getDB()
    .collection(rule_collection)
    .insertOne(rule);
  res.json(rule + 'CREATED');
};

exports.getRule = (req, res, next) => {
  res.send(db.inventory.find({ timeStamp: req.params.id }));
};

exports.updateRule = (req, res, next) => {
  const rule = {
    sampleType: req.body.type,
    operator: req.body.operator,
    value: req.body.value
  };
  db.getDB()
    .collection(ds_collection)
    .updateOne({ _id: req.params.id }, rule);
  res.send(rule + 'UPDATED');
};

exports.deleteRule = (req, res, next) => {
  db.inventory.deleteOne({ _id: req.params.id });
  res.send('DELETED');
};
//qury lsat entey from db
exports.evalRule = (req, res, next) => {
  db.inventory.find({ _id: req.params.id }).then(documents => {
    const triCondition = documents.indexOf('and') ? 'and' : null;
    const isBinary = documents.indexOf('or') ? 'or' : triCondition;
    const splitOpt = isBinary ? null : 0;
    return evaluate(documents, splitOpt);
  });
};

const evaluate = (documents, splitOpt) => {
  let typeLastRecorededValue;
  let result = false;
  documents.split(isBinary, splitOpt).map(formulaFrame => {
    const type = documents
      .split('{')
      .pop()
      .split('}')[0];

    const operator = documents.split('}')[0];
    const value = documents.split(' ')[2];
    db.inventory.find({ sampleType: type }).then(documents => {
      typeLastRecorededValue = documents.value;
    });
    result =
      operator === '<'
        ? typeLastRecorededValue < value
        : operator === '>'
        ? typeLastRecorededValue > value
        : typeLastRecorededValue === value;
  });
  return result;
};
