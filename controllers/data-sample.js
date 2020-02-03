const collection = 'ds_collection';

exports.createSample = (req, res, next) => {
  const dataSmple = {
    timeStamp: Date.now(),
    sampleType: req.body.type,
    value: req.body.value
  };
  db.getDB()
    .collection(collection)
    .insertOne(dataSmple, (err, docs) => {
      if (err) {
        console.log('couldnt create');
        return;
      }
    });
  res.json(dataSmple + 'CREATED');
};

exports.getSample = (req, res, next) => {
  db.collection(collection).find({ _id: req.params.id }, (err, docs) => {
    if (err) {
      console.log('cant find ds');
      return;
    }
    res.json(docs);
  });
};

exports.updateSample = (req, res, next) => {
  const dataSmple = {
    timeStamp: Date.now(),
    sampleType: req.body.type,
    value: req.body.value
  };
  db.getDB()
    .collection(collection)
    .updateOne({ _id: req.params.id }, dataSmple, (err, dcos) => {
      if (err) {
        console.log('couldnt update ds');
      }
    });
  res.send(dataSmple + 'UPDATED');
};

exports.deleteSample = (req, res, next) => {
  db.inventory.deleteOne({ _id: req.params.id }, () => {
    if (err) {
      console.log('couldnt remove ds');
    }
  });
  res.send('DELETED');
};
