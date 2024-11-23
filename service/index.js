const cookieParser = require('cookie-parser');
const argon2 = require('argon2');
const express = require('express');
const app = express();
const uuid = require('uuid');
const DB = require('./database.js');

const authCookieName = 'token';

// The service port may be set on the command line
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the application's static content
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Authentication Routes
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.email, req.body.password);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.email);
  if (user) {
    if (await argon2.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// secureApiRouter verifies credentials for endpoints
const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Inventory Routes
secureApiRouter.get('/inventory', async (_req, res) => {
  try {
    const inventory = await DB.getInventory();
    res.send(inventory);
  } catch (err) {
    res.status(500).send({ msg: 'Error retrieving inventory' });
  }
});

secureApiRouter.post('/inventory', async (req, res) => {
  const { item, icn, client } = req.body;
  if (!item || !icn || !client) {
    return res.status(400).send({ msg: 'Missing required fields' });
  }
  try {
    const newItem = await DB.addInventoryItem(item, icn, client);
    res.status(201).send(newItem);
  } catch (err) {
    res.status(500).send({ msg: 'Error adding inventory item' });
  }
});

// Job Routes
secureApiRouter.get('/jobs', async (_req, res) => {
  try {
    const jobs = await DB.getJobs();
    res.send(jobs);
  } catch (err) {
    res.status(500).send({ msg: 'Error retrieving jobs' });
  }
});

secureApiRouter.post('/jobs', async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).send({ msg: 'Missing required fields' });
  }
  try {
    const newJob = await DB.addJob(title, description);
    res.status(201).send(newJob);
  } catch (err) {
    res.status(500).send({ msg: 'Error adding job' });
  }
});

// Chat Routes
secureApiRouter.get('/chat', (_req, res) => {
  res.json(chatMessages);
});

secureApiRouter.post('/chat', (req, res) => {
  const { user, text } = req.body;
  if (!user || !text) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }
  const newMessage = { id: uuid.v4(), user, text, timestamp: new Date() };
  chatMessages.push(newMessage);
  res.status(201).json(newMessage);
});

// Default error handler
app.use((err, req, res, next) => {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Set the authentication cookie
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
