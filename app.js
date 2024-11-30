const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // Para IDs únicos de listas
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let listas = {}; // Almacén de listas compartidas

// Configuración del servidor
app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');

// Notificaciones con Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado.');

  socket.on('sendNotification', (data) => {
    io.emit('receiveNotification', data);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado.');
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.render('index', { listas });
});

// API para compartir listas
app.post('/api/share-list', (req, res) => {
  const { name, items, budget } = req.body;
  const id = uuidv4();
  listas[id] = { name, items, budget };
  res.json({ link: `http://localhost:5500/shared/${id}` });
});

// Ruta para listas compartidas
app.get('/shared/:id', (req, res) => {
  const lista = listas[req.params.id];
  if (lista) {
    res.render('shared', { lista });
  } else {
    res.status(404).send('Lista no encontrada');
  }
});

// Iniciar servidor
const PORT = 6666;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
