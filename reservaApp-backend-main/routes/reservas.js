const express = require('express');
const router = express.Router();

let reservas = [
  {
    id: 1,
    customerName: 'Jose Perez',
    customerPhone: '099999999',
    guests: 2,
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    tableId: 'M1',
    status: 'Activa'
  }
];

// Obtener todas las reservas
router.get('/', (req, res) => {
  res.json(reservas);
});

// Crear una nueva reserva
router.post('/', (req, res) => {
  const { customerName, customerPhone, guests, date, time, tableId } = req.body;

  if (!customerName || !customerPhone || !guests || !date || !time || !tableId) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const nuevaReserva = {
    id: reservas.length + 1,
    customerName,
    customerPhone,
    guests,
    date,
    time,
    tableId,
    status: 'Pendiente',

  };

  reservas.push(nuevaReserva);
  res.status(201).json(nuevaReserva);
});

// Actualizar una reserva
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = reservas.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ error: 'Reserva no encontrada' });

  reservas[index] = { ...reservas[index], ...req.body };
  res.json(reservas[index]);
});

// Eliminar una reserva
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = reservas.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ error: 'Reserva no encontrada' });

  const eliminada = reservas.splice(index, 1);
  res.json(eliminada[0]);
});

module.exports = router;
