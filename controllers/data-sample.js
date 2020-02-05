const db = require('../data/db');
const collection = 'ds_collection';

exports.createSample = (req, res, next) => {
  const dataSmple = {
    timeStamp: new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Jerusalem'
    }),
    sampleType: req.body.type,
    value: req.body.value
  };
  db.getDB()
    .collection(collection)
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
    .collection(collection)
    .findOne(
      { _id: db.getPrimaryKey(req.params.id) },
      { projection: { _id: 0, timeStamp: 1, sampleType: 1, value: 1 } },
      (err, sample) => {
        if (err) {
          console.log('couldnt get data sample');
        } else {
          res.json(sample);
        }
      }
    );
};

exports.updateSample = (req, res, next) => {
  const dataSmple = {
    timeStamp: new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Jerusalem'
    }),
    sampleType: req.body.type,
    value: req.body.value
  };
  db.collection(collection).updateOne(
    { _id: db.getPrimaryKey(req.params.id) },
    dataSmple,
    (err, result) => {
      if (err) {
        console.log('couldnt update ds');
      } else {
        res.json(result + 'UPDATED');
      }
    }
  );
};

exports.deleteSample = (req, res, next) => {
  db.collection(collection).deleteOne(
    { _id: db.getPrimaryKey(req.params.id) },
    (err, result) => {
      if (err) {
        console.log('couldnt remove ds');
      } else {
        res.json(result + 'DELETED');
      }
    }
  );
};
