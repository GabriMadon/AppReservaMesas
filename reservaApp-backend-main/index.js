const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

const reservasRoutes = require('./routes/reservas'); // Importar las rutas de reservas

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/login', authRoutes);

app.use('/api/reservas', reservasRoutes); // Usar las rutas de reservas

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://192.168.18.4:${PORT}`);
});
