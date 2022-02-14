const { MongoClient, ObjectId } = require('mongodb');

const id = new ObjectId();
console.log(id);
console.log(id.getTimestamp());

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if(error) {
    return console.log('Unable to connect to database');
  }
  const db = client.db(databaseName);

  const update = db.collection('tasks').deleteOne({ description: 'Buy milk' });
  update.then(() => {
    console.log(true);
  }).catch(() => {
    console.log(false);
  });

});