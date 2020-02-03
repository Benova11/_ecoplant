const db = require('../data/db');

exports.createSample = (req, res, next) => {
  const dataSmple = {
    timeStamp: Date.now(),
    sampleType: req.body.type,
    value: req.body.value
  };
  db.getDB()
    .collection('ds_collection')
    .insertOne(dataSmple, (err, result) => {
      if (err) {
        console.log('couldnt create');
      } else {
        res.json(result + 'CREATED');
      }
    });
};

exports.getSample = (req, res, next) => {
  db.getDB()
    .collection('ds_collection')
    .find(
      { _id: db.getPrimaryKey(req.params.id) },
      { projection: { _id: 0, timeStamp: 1, sampleType: 1, value: 1 } }
    )
    .toArray((err, sample) => {
      if (err) {
        console.log('couldnt get data sample');
      } else {
        res.send(sample);
      }
    });
};

exports.updateSample = (req, res, next) => {
  const dataSmple = {
    timeStamp: Date.now(),
    sampleType: req.body.type,
    value: req.body.value
  };
  db.collection('ds_collection').updateOne(
    { _id: db.getPrimaryKey(req.params.id) },
    dataSmple,
    (err, result) => {
      if (err) {
        console.log('couldnt update ds');
      } else {
        res.send(result + 'UPDATED');
      }
    }
  );
};

exports.deleteSample = (req, res, next) => {
  db.collection('ds_collection').deleteOne(
    { _id: db.getPrimaryKey(req.params.id) },
    (err, result) => {
      if (err) {
        console.log('couldnt remove ds');
      } else {
        res.send(result + 'DELETED');
      }
    }
  );
};
