import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { ReservaForm } from "../PanelAdmi/reserva.types";

interface Props {
  reservas: ReservaForm[];
}

export const ListaReservas = ({ reservas }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Lista Reservas - Todas las Reservas</Text>

      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Nombre</Text>
        <Text style={styles.headerCell}>Fecha</Text>
        <Text style={styles.headerCell}>Hora</Text>
        <Text style={styles.headerCell}>Mesa</Text>
        <Text style={styles.headerCell}>Estado</Text>
      </View>

      {reservas.map((r, idx) => (
        <View key={idx} style={styles.row}>
          <Text style={styles.cell}>{r.customerName}</Text>
          <Text style={styles.cell}>{r.date}</Text>
          <Text style={styles.cell}>{r.time}</Text>
          <Text style={styles.cell}>{r.tableId}</Text>
          <Text style={styles.cell}>{r.status}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
    color: "#004080",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    color: "#333",
  },
});
