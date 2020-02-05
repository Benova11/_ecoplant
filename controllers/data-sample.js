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
  try {
    db.getDB()
      .collection(collection)
      .insertOne(dataSmple, (err, result) => {
        if (err) {
          throw new Error('something went wrong...');
        }
        res.json(result + 'CREATED');
      });
  } catch (err) {
    console.err(err);
  }
};

exports.getSample = (req, res, next) => {
  try {
    db.getDB()
      .collection(collection)
      .findOne(
        { _id: db.getPrimaryKey(req.params.id) },
        { projection: { _id: 0, timeStamp: 1, sampleType: 1, value: 1 } },
        (err, sample) => {
          if (err) {
            throw new Error('something went wrong...');
          }
          res.json(sample);
        }
      );
  } catch (err) {
    console.err(err);
  }
};

exports.updateSample = (req, res, next) => {
  const dataSmple = {
    timeStamp: new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Jerusalem'
    }),
    sampleType: req.body.type,
    value: req.body.value
  };
  try {
    db.collection(collection).updateOne(
      { _id: db.getPrimaryKey(req.params.id) },
      dataSmple,
      (err, result) => {
        if (err) {
          throw new Error('something went wrong...');
        }
        res.json(result + 'UPDATED');
      }
    );
  } catch (err) {
    console.err(err);
  }
};

exports.deleteSample = (req, res, next) => {
  try {
    db.collection(collection).deleteOne(
      { _id: db.getPrimaryKey(req.params.id) },
      (err, result) => {
        if (err) {
          throw new Error('something went wrong...');
        }
        res.json(result + 'DELETED');
      }
    );
  } catch (err) {
    console.err(err);
  }
};
