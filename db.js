const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const db_name = 'ecoPlantDB';
const url = 'mongodb://localhost:27017';
const mongoOptions = { useNewUrlParser: true };

const client = new MongoClient(url);

client.connect(err => {
  if (err) {
    console.log('couldnt connect to db');
    return;
  }
  const db = client.db(db_name);
  console.log('Connected to server');
  client.close();
});

const dbState = {
  db: null
};

const connect = cb => {
  if (dbState.db) {
    cb();
    return;
  }
  MongoClient.connect(url, mongoOptions, (err, client) => {
    if (err) {
      cb(err);
    } else {
      dbState.db = client.db(db_name);
    }
  });
};
