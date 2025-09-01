import { useMemo } from "react";
import type { ReservaForm } from "../pages/PanelAdmin/reservas.types"; // Make sure this path is correct, or update it to the actual location of reservas.types.ts
 // Make sure this path is correct, or update it to the actual location of reservas.types.ts

interface Props {
  reservas: ReservaForm[];
  mesa: string;
  fecha: string;
  reservaEnEdicion?: ReservaForm; // para no bloquearse a sí misma
}

export function useHorasDisponibles({ reservas, mesa, fecha, reservaEnEdicion }: Props) {
  const todasLasHoras = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) =>
      `${(12 + i).toString().padStart(2, "0")}:00`
    );
  }, []);

  const horasOcupadas = useMemo(() => {
    return reservas
      .filter(
        (r) =>
          r.date === fecha &&
          r.tableId === mesa &&
          r.id !== reservaEnEdicion?.id
      )
      .map((r) => r.time);
  }, [reservas, mesa, fecha, reservaEnEdicion]);

  const horasDisponibles = useMemo(() => {
    return todasLasHoras.filter((hora) => !horasOcupadas.includes(hora));
  }, [todasLasHoras, horasOcupadas]);

  return horasDisponibles;
}
