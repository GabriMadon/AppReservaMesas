import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { ReservaForm } from "../PanelAdmi/reserva.types";

interface Props {
  mesaId: string;
  reservas: ReservaForm[];
}

const estadoColorMap: Record<string, { background: string; text: string }> = {
  Activa: { background: "#cce4ff", text: "#0057b8" },
  Pendiente: { background: "#fff4cc", text: "#b88a00" },
  Finalizada: { background: "#e0e0e0", text: "#555" },
  Cancelada: { background: "#ffd6d6", text: "#a30000" },
  Disponible: { background: "#d4fdd4", text: "#007a00" },
};

export const EstadoReserva = ({ mesaId, reservas }: Props) => {
  const hoy = new Date().toISOString().split("T")[0];
  const reservasDeHoy = reservas.filter((r) => r.tableId === mesaId && r.date === hoy);

  if (reservasDeHoy.length === 0) {
    const estilos = estadoColorMap["Disponible"];
    return (
      <View style={[styles.card, { backgroundColor: estilos.background, borderColor: estilos.text }]}>
        <Text style={[styles.titulo, { color: estilos.text }]}>Mesa {mesaId}</Text>
        <Text style={{ color: estilos.text }}>Disponible</Text>
      </View>
    );
  }

  return reservasDeHoy.map((reserva, idx) => {
    const estado = reserva.status || "Disponible";
    const estilos = estadoColorMap[estado];

    return (
      <View key={`${mesaId}-${idx}`} style={{ marginBottom: 12 }}>

        <View style={[styles.card, { backgroundColor: estilos.background, borderColor: estilos.text }]}>
          <Text style={[styles.titulo, { color: estilos.text }]}>Mesa {mesaId}</Text>
          <Text style={{ color: estilos.text }}>Estado: {estado}</Text>
        </View>
        <View style={styles.info}>
          <Text>Fecha: {reserva.date}</Text>
          <Text>Hora: {reserva.time}</Text>
        </View>
      </View>
    );
  });
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom:12
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
  },
  info: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
});
