const API_URL = 'http://192.168.18.4:3001/api/reservas'; // IP local de tu PC
import type { ReservaForm, ReservaRequest } from './reserva.types';


export const obtenerReservas = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const eliminarReserva = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};

export const crearOActualizarReserva = async (reserva: { id: any; }) => {
  const method = reserva.id ? 'PUT' : 'POST';
  const endpoint = reserva.id ? `${API_URL}/${reserva.id}` : API_URL;

  const res = await fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reserva),
  });

  return res.json();
};
