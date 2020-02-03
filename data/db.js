const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const db_name = 'ecoPlantDB';
const url = 'mongodb://localhost:127.0.0.1:27017';
const mongoOptions = { useNewUrlParser: true };

const state = {
  db: null
};

const connect = cb => {
  if (state.db) {
    cb();
  } else {
    MongoClient.connect(url, mongoOptions, (err, client) => {
      if (err) {
        cb(err);
      } else {
        state.db = client.db(db_name);
        cb();
      }
    });
  }
};

const getPrimaryKey = _id => {
  return ObjectID(_id);
};

const getDB = () => {
  return state.db;
};

module.exports = { connect, getDB, getPrimaryKey };
