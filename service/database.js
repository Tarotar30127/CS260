const { MongoClient } = require('mongodb');
const argon2 = require('argon2');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}/<db></db>?retryWrites=true&w=majority`;
const client = new MongoClient(url, {
  tls: true,
  serverSelectionTimeoutMS: 3000,
  autoSelectFamily: false,
});
const db = client.db('start');
const userCollection = db.collection('user');
const jobCollection = db.collection('job');
const inventoryCollection = db.collection('inventory');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await argon2.hash(password);
  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await userCollection.insertOne(user);

  return user;
}
// Inventory Functions
async function getInventory() {
  return inventoryCollection.find({}).toArray();
}

async function addInventoryItem(item, icn, clientName) {
  const newItem = {
    item,
    icn,
    client: clientName,
  };
  await inventoryCollection.insertOne(newItem);
  return newItem;
}

// Job Functions
async function getJobs() {
  return jobCollection.find({}).toArray();
}

async function addJob(title, description) {
  const newJob = {
    title,
    description,
  };
  await jobCollection.insertOne(newJob);
  return newJob;
}

// Export the functions
module.exports = {
  getUser,
  getUserByToken,
  createUser,
  getInventory,
  addInventoryItem,
  getJobs,
  addJob,
};
