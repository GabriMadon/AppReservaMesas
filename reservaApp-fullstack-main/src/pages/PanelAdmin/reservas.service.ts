import axios from 'axios';
import type { ReservaForm, ReservaRequest } from './reservas.types';

const API_URL = import.meta.env.VITE_API_URL;

export const obtenerReservas = async (): Promise<ReservaForm[]> => {
  const res = await axios.get(`${API_URL}/reservas`);
  return res.data;
};
export const enviarReservas = async (data: ReservaRequest) => {
  await axios.post(`${API_URL}/reservas`, data);
};

export const actualizarReserva = async (


  id: number,
  customerName: string,
  customerPhone: string,
  guests: number,
  date: string,
  time: string,
  tableId: string,
  status: string



) => {
  const res = await axios.put(`${API_URL}/reservas/${id}`, {
  customerName,
  customerPhone,
  guests,
  date,
  time,
  tableId,
  status,
  });
  return res.data;
};

export const eliminarReserva = async (id: number) => {
  const res = await axios.delete(`${API_URL}/reservas/${id}`);
  return res.data;
};