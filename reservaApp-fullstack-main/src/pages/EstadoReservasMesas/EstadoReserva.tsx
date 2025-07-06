import React, { useEffect, useState } from "react";
import type { ReservaForm } from "../PanelAdmin/reservas.types";
import { obtenerReservas } from "../PanelAdmin/reservas.service";

const EstadoReserva = () => {
  const [reservas, setReserva] = useState<ReservaForm[]>([]);
  const mesas = ["M1", "M2", "M3", "M4", "M5", "M6"];

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const data = await obtenerReservas();
        console.log("Reservas obtenidas estadoReservas:", data);
        setReserva(data);
      } catch (error) {
        console.error("Error al obtener las reservas:", error);
      }
    };
    cargarReservas();
  }, []);

  const obtenerReservaDelMomento = (mesaId: string): ReservaForm[] => {
    if (reservas.length === 0) return []; // Si no hay reservas, retorna array vacío
    const hoy = new Date().toISOString().split("T")[0];
    console.log(
      "Buscando reserva para:",
      mesaId,
      "en",
      reservas.length,
      "reservas"
    );
    return reservas.filter(
      (r) =>
        r.tableId === mesaId.toString() &&
        r.date === hoy &&
        ["Activa", "Pendiente"].includes(r.status)
    );
  };

  return (
    <div className="flex flex-wrap gap-8">
      <h1 className="text-xl font-bold w-full mb-4">Estado Mesas - Reservas Diarias</h1>
      
      {mesas.map((mesaId) => {
        const reservasPorMesa = obtenerReservaDelMomento(mesaId) || [];

        return reservasPorMesa.length > 0 ? (
          reservasPorMesa.map((reserva, idx) => {
            const estado = reserva.status as "Activa" | "Pendiente" | "Finalizada" | "Cancelada" | "Disponible";
            const fecha = reserva.date;
            const hora = reserva.time;

            const estadoColorMap: Record<"Activa" | "Pendiente" | "Finalizada" | "Cancelada" | "Disponible", string> = {
              Activa: "bg-blue-100 text-blue-800 border-blue-300",
              Pendiente: "bg-yellow-100 text-yellow-800 border-yellow-300",
              Finalizada: "bg-gray-100 text-gray-800 border-gray-300",
              Cancelada: "bg-red-100 text-red-800 border-red-300",
              Disponible: "bg-green-100 text-green-800 border-green-300",
            };
            const estadoColor = estadoColorMap[estado];

            return (
              <div
                key={`${mesaId}-${idx}`}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div
                  className={`w-60 p-4 rounded-xl shadow-md border ${estadoColor}`}
                >
                  <h3 className="text-xl font-bold mb-1">Mesa {mesaId}</h3>
                  <p className="text-sm">
                    Estado: <span className="font-semibold">{estado}</span>
                  </p>
                </div>
                <div className="w-60 p-4 rounded-xl shadow-md border border-gray-300 bg-gray-100 text-gray-800">
                  <p className="text-sm">
                    Fecha: <span className="font-medium">{fecha}</span>
                  </p>
                  <p className="text-sm mt-1">
                    Hora: <span className="font-medium">{hora}</span>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div
            key={mesaId}
            className="w-60 p-4 rounded-xl border shadow-md text-gray-500"
          >
            <h3 className="font-bold">Mesa {mesaId}</h3>
            <p>Disponible</p>
          </div>
        );
      })}
    </div>
  );
};

export default EstadoReserva;
