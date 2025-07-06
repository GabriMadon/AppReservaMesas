import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  vistaActual: "panel" | "estado" | "lista";
  onCambiarVista: (vista: "panel" | "estado" | "lista") => void;
}

export const HeaderNav = ({ vistaActual, onCambiarVista }: Props) => (
  <View style={styles.navBar}>
    <TouchableOpacity
      onPress={() => onCambiarVista("panel")}
      style={[
        styles.navBtn,
        vistaActual === "panel" && styles.activo,
      ]}
    >
      <Text style={styles.navText}>Panel Admin</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => onCambiarVista("estado")}
      style={[
        styles.navBtn,
        vistaActual === "estado" && styles.activo,
      ]}
    >
      <Text style={styles.navText}>Estado Mesas</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => onCambiarVista("lista")}
      style={[
        styles.navBtn,
        vistaActual === "lista" && styles.activo,
      ]}
    >
      <Text style={styles.navText}>Lista Reservas</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0", // 🧼 fondo suave y neutral
  },

  navBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  navText: {
    color: "#333", // texto oscuro y legible
    fontWeight: "bold",
    fontSize: 13,
  },

  activo: {
    backgroundColor: "#dddddd", // 🔘 gris claro para botón activo
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
});



