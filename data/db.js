const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const db_name = 'ecoPlantDB';
const url = 'mongodb://localhost:27017';
const mongoOptions = { useNewUrlParser: true };

const dbState = {
  db: null
};

const connect = cb => {
  if (dbState.db) {
    cb();
  }
  MongoClient.connect(url, mongoOptions, (err, client) => {
    if (err) {
      cb(err);
    } else {
      dbState.db = client.db(db_name);
      cb();
    }
  });
};

const getPrimaryKey = _id => {
  return ObjectID(_id);
};

const getDB = () => {
  return dbState.db;
};

module.exports = { getDB, connect, getPrimaryKey };
