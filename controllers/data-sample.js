const db = require('../data/db');
var schedule = require('node-schedule');

const collection = 'ds_collection';

//printing the result
//cant return res.send() unless use socket or get request polling
//so print in console
exports.getEtlQuery = (req, res, next) => {
  const operation = req.params.operation;
  const typeToQuery = req.params.type;

  const intervals = ['0 * * * * *', '0 0 * * * *'];
  if (!operation || !typeToQuery) {
    res.send('type/operation does not exists!');
  }
  try {
    intervals.forEach(interval => {
      schedule.scheduleJob(interval, () => {
        db.getDB()
          .collection(collection)
          .find({ sampleType: typeToQuery })
          .toArray(function(err, results) {
            if (err) {
              throw new Error('something went wrong...');
            }
            let values = results.map(result => {
              return result.value;
            });

            switch (operation) {
              case 'max': {
                console.log(Math.max(...values));
                break;
              }
              case 'min': {
                console.log(Math.min(...values));
                break;
              }
              case 'average': {
                const sum = values.reduce((a, b) => a + b, 0);
                const avg = sum / values.length || 0;
                console.log(avg);
                break;
              }
              case 'count': {
                console.log(values.length);
                break;
              }
            }
          });
      });
    });
  } catch (err) {
    console.error(err);
  }
};

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
    console.error(err);
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
    console.error(err);
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
    console.error(err);
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
    console.error(err);
  }
};
//wasnt sure if could use mongo aggregtion (based on the last comment of the asiggnment)
//tried it anyway
// try {
//   let job = schedule.scheduleJob('*/1 * * * *', () => {
//     db.getDB()
//       .collection(collection)
//       .aggregate([
//         {
//           $group: {
//             _id: '$sampleType',
//             value: { $max: '$value' }
//           }
//         }
//       ])
//       .toArray(function(err, results) {
//         console.log(results);
//       });
//   });
// } catch (err) {}
