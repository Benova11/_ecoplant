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
  const triCondition = documents.indexOf('and') ? 'and' : null;
  const isBinary = documents.indexOf('or') ? 'or' : triCondition;
  const splitOpt = isBinary ? null : 0;
  let typeLastRecorededValue;
  let result = false;
  const formulas = documnets.split(isBinary, splitOpt).map(formulaFrame => {
    const type = documnets
      .split('{')
      .pop()
      .split('}')[0];
    const operator = documnets.split('}')[0];
    const value = documnets.split(' ')[2];
    db.inventory.find({ sampleType: type }).then(documnets => {
      typeLastRecorededValue = documnets.value;
    });
    result =
      operator === '<'
        ? typeLastRecorededValue < value
        : operator === '>'
        ? typeLastRecorededValue > value
        : typeLastRecorededValue === value;
  });
};
