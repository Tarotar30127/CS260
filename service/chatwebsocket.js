const { WebSocketServer } = require('ws');
const uuid = require('uuid');

function userWebsoc(httpServer) {
  // Create a WebSocket object
  const wss = new WebSocketServer({ noServer: true });

  // Handle the protocol upgrade from HTTP to WebSocket
  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  });

  // Store active connections and chat messages
  let connections = [];
  let chatMessages = [];

  // Handle WebSocket connections
  wss.on('connection', (ws) => {
    const connection = { id: uuid.v4(), ws: ws };
    connections.push(connection);

    // Send all previous chat messages to the new user
    ws.send(JSON.stringify({ type: 'chatMessages', messages: chatMessages }));

    // Handle incoming messages from clients
    ws.on('message', (data) => {
      const messageData = JSON.parse(data);
      
      if (messageData.type === 'message') {
        // Add new message to the chat history
        chatMessages.push({ user: messageData.user, text: messageData.text });

        // Broadcast the new message to all clients
        connections.forEach((c) => {
          if (c.id !== connection.id) {
            c.ws.send(JSON.stringify({
              type: 'message',
              user: messageData.user,
              text: messageData.text
            }));
          }
        });
      }
    });

    // Remove the connection when it closes
    ws.on('close', () => {
      const index = connections.findIndex((c) => c.id === connection.id);
      if (index >= 0) {
        connections.splice(index, 1);
      }
    });
  });

  // Keep active connections alive
  setInterval(() => {
    connections.forEach((c) => {
      c.ws.ping();
    });
  }, 10000);
}

module.exports = { userWebsoc };
