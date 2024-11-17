const express = require('express');
const uuid = require('uuid');
const app = express();

// The scores, users, inventory, and jobs are saved in memory and disappear whenever the service is restarted.
let users = {};
let inventory = [];  // Declare inventory array
let jobs = [];       // Declare jobs array
let activeUsers =[];
let chatMessages = [];

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  const user = users[req.body.email];
  if (user) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = { email: req.body.email, password: req.body.password, token: uuid.v4() };
    users[user.email] = user;

    res.send({ token: user.token });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = users[req.body.email];
  if (user) {
    if (req.body.password === user.password) {
      user.token = uuid.v4();
      res.send({ token: user.token });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', (req, res) => {
  const user = Object.values(users).find((u) => u.token === req.body.token);
  if (user) {
    delete user.token;
  }
  res.status(204).end();
});

apiRouter.get('/users/active', (_req, res) => {
  res.json(activeUsers);
});

apiRouter.post('/users/active', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ msg: 'Email is required' });
  }

  // Check if the user already exists in the activeUsers list
  if (!activeUsers.includes(email)) {
    activeUsers.push(email);
  }

  res.status(201).send({ msg: 'User added to active users' });
});

// Chat messages
apiRouter.get('/chat', (_req, res) => {
  res.json(chatMessages);
});

apiRouter.post('/chat', (req, res) => {
  const { user, text } = req.body;
  if (!user || !text) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }

  const newMessage = { id: uuid.v4(), user, text, timestamp: new Date() };
  chatMessages.push(newMessage);

  res.status(201).json(newMessage);
});

// Get inventory items
apiRouter.get('/inventory', (_req, res) => {
  res.send(inventory); // Send the current list of inventory items
});

// Add Inventory Item
apiRouter.post('/inventory', (req, res) => {
  const { item, icn, client } = req.body;

  if (!item || !icn || !client) {
    return res.status(400).send({ msg: 'Missing required fields' });
  }

  // Create a new inventory item with a unique ID
  const newInventoryItem = { id: uuid.v4(), item, icn, client };
  inventory.push(newInventoryItem);

  // Return the updated inventory list
  res.send(inventory);
});

// Get jobs
apiRouter.get('/jobs', (_req, res) => {
  res.send(jobs); // Send the current list of jobs
});

// Add Job (new route)
apiRouter.post('/jobs', (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).send({ msg: 'Missing required fields' });
  }

  const newJob = { id: uuid.v4(), title, description };
  jobs.push(newJob);

  res.send(jobs);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
