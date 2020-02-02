exports.createSample = (req, res, next) => {
  const dataSmple = {
    timeStamp: Date.now(),
    sampleType: req.body.type,
    value: req.body.value
  };
  db.getDB()
    .collection(ds_collection)
    .insertOne(dataSmple);
  res.json(dataSmple + 'CREATED');
};

exports.getSample = (req, res, next) => {
  res.send(db.inventory.find({ timeStamp: req.params.id }));
};

exports.updateSample = (req, res, next) => {
  const dataSmple = {
    timeStamp: Date.now(),
    sampleType: req.body.type,
    value: req.body.value
  };
  db.getDB()
    .collection(ds_collection)
    .updateOne({ _id: req.params.id }, dataSmple);
  res.send(dataSmple + 'UPDATED');
};

exports.deleteSample = (req, res, next) => {
  db.inventory.deleteOne({ _id: req.params.id });
  res.send('DELETED');
};
