import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  GestureResponderEvent,
} from "react-native";
import { HeaderNav } from "../HeaderNav/HeaderNav";
import { obtenerReservas, eliminarReserva } from "./reservas.services";
import type { ReservaForm } from './reserva.types';
import { Modalreservas } from './Modalreservas';
import { EstadoReserva } from "../EstadoReservas/EstadoReservas";
import { ListaReservas } from "../ListaRservas/ListaReservas";

export default function ReservasScreen() {
  const [reserva, setReserva] = useState<ReservaForm[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reservaEditar, setReservaEditar] = useState<ReservaForm | null>(null);

  const [vistaActual, setVistaActual] = useState<"panel" | "estado" | "lista">("panel");
  const [mesas, setMesas] = useState<string[]>(["M1", "M2", "M3", "M4", "M5", "M6"]);

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const data = await obtenerReservas();
      setReserva(data);
    } catch (error) {
      console.error("Error al obtener reservas:", error);
    }
  };

  const abrirModal = (datosParciales = {}) => {
    const base = {
      id: 0,
      customerName: "",
      customerPhone: "",
      guests: 1,
      date: "",
      time: "",
      tableId: "",
      status: "Pendiente",
      ...datosParciales,
    };
    setReservaEditar(base);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setReservaEditar(null);
    setMostrarModal(false);
    cargarReservas();
  };
  /* funcion eliminar Reserva */
  const confirmarEliminacion = (id: number) => {
    Alert.alert("Confirmación", "¿Está seguro de eliminar la reserva?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Aceptar",
        onPress: async () => {
          await eliminarReserva(id);
          setReserva((prev) => prev.filter((c) => c.id !== id));
        },
      },
    ]);
  };

  function handleLogout(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 60 }]}>
      <HeaderNav vistaActual={vistaActual} onCambiarVista={setVistaActual} />


      {vistaActual === "panel" && (
        <>
          <Text style={styles.header}>Panel de Administrador</Text>

          <TouchableOpacity>
            <Text> </Text>
          </TouchableOpacity>

          <Text style={styles.subheader}>Seleccione una Mesa</Text>

          {/*     <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>Panel de Reservas</Text> */}
          {/* btn añadir mesa */}
          <TouchableOpacity
            onPress={() => {
              // Extraer solo los números
              const usados = mesas.map(m => parseInt(m.replace("M", "")));

              // Buscar el número más alto
              const max = Math.max(...usados);

              // Generar nuevo número como siguiente disponible
              let nuevoNumero = max + 1;
              let nuevaMesa = `M${nuevoNumero}`;

              // Asegurarse de que no se repita (por si hay huecos)
              while (mesas.includes(nuevaMesa)) {
                nuevoNumero++;
                nuevaMesa = `M${nuevoNumero}`;
              }

              setMesas(prev => [...prev, nuevaMesa]);
            }}
            style={{ marginBottom: 12 }}
          >

            <Text style={{ backgroundColor: "#007AFF", color: "white", textAlign: "center", padding: 10, borderRadius: 6 }}>
              ➕ Añadir Mesa
            </Text>
          </TouchableOpacity>

          {/* gird mesa */}
          <View style={styles.grid}>
            {mesas.map((mesa) => (
              <View key={mesa} style={styles.mesaWrapper}>
                <View style={styles.mesaCard}>
                  <TouchableOpacity
                    style={styles.mesaButton}
                    onPress={() => abrirModal({ tableId: mesa })}
                  >
                    <Text style={styles.icon}>🍽️</Text>
                    <Text>Mesa {mesa.replace("M", "")}</Text>
                  </TouchableOpacity>

                </View>
              </View>
            ))}
          </View>


          <TouchableOpacity
            onPress={() => {
              const mesasDinamicas = mesas
                .filter(m => parseInt(m.replace("M", "")) > 6)
                .sort((a, b) => parseInt(b.replace("M", "")) - parseInt(a.replace("M", "")));

              if (mesasDinamicas.length === 0) {
                Alert.alert("Sin mesas dinámicas", "No hay mesas agregadas para eliminar.");
                return;
              }

              const ultimaMesa = mesasDinamicas[0]; // mesa con el número más alto

              // Crear un objeto que mapea mesaId a reservas
              const reservasPorMesa: { [key: string]: ReservaForm[] } = {};
              reserva.forEach(r => {
                if (!reservasPorMesa[r.tableId]) reservasPorMesa[r.tableId] = [];
                reservasPorMesa[r.tableId].push(r);
              });

              const reservasMesa = reservasPorMesa[ultimaMesa] ?? [];

              if (reservasMesa.length > 0) {
                Alert.alert(
                  "Mesa con reservas",
                  `No puedes eliminar la ${ultimaMesa} porque tiene ${reservasMesa.length} reserva(s) activa(s).`,
                  [{ text: "OK" }]
                );
                return;
              }

              setMesas(prev => prev.filter(m => m !== ultimaMesa));

            }}
            style={{
              backgroundColor: "#FF4136",
              padding: 10,
              borderRadius: 6,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
              🗑️ Eliminar Última Mesa Añadida
            </Text>
          </TouchableOpacity>


          {/* muestra las reservas realizadas podemos eliminar o modificar */}
          <View style={styles.listaReservas}>
            {reserva.map((m) => (
              <View key={m.id} style={styles.card}>
                <Text style={styles.item}><Text style={styles.label}>ID:</Text> {m.id}</Text>
                <Text style={styles.item}><Text style={styles.label}>Nombre:</Text> {m.customerName}</Text>
                <Text style={styles.item}><Text style={styles.label}>Teléfono:</Text> {m.customerPhone}</Text>
                <Text style={styles.item}><Text style={styles.label}>Personas:</Text> {m.guests}</Text>
                <Text style={styles.item}><Text style={styles.label}>Fecha:</Text> {m.date}</Text>
                <Text style={styles.item}><Text style={styles.label}>Hora:</Text> {m.time}</Text>
                <Text style={styles.item}><Text style={styles.label}>Mesa:</Text> {m.tableId}</Text>
                <Text style={styles.item}><Text style={styles.label}>Estado:</Text> {m.status}</Text>

                <View style={styles.acciones}>
                  <TouchableOpacity onPress={() => abrirModal(m)}>
                    <Text style={styles.btnEditar}>✏️ Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmarEliminacion(m.id)}>
                    <Text style={styles.btnEliminar}>🗑️ Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Vista Estado Reservas */}
      {vistaActual === "estado" && (
        <>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>Estado de las Mesas</Text>
          {mesas.map((mesaId) => (
            <EstadoReserva key={mesaId} mesaId={mesaId} reservas={reserva} />

          ))}
        </>
      )}
      {/* Vista Lista Reservas */}
      {vistaActual === "lista" && (
        <>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>Lista Reservas - Todas las Reservas</Text>
          <ListaReservas reservas={reserva} />
        </>
      )}

      {mostrarModal && (
        <Modalreservas
          onClose={cerrarModal}
          reservas={reservaEditar}
          todasLasReservas={reserva}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  subheader: { fontSize: 16, color: "teal", marginVertical: 12 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  mesaButton: {
    width: "100%",
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    alignItems: "center",
    /*     justifyContent: "center",
        minHeight: 100, */

  },

  mesaWrapper: {
    width: "30%",
    marginBottom: 12,


  },

  mesaCard: {
    width: "100%",
    alignItems: "center",
  },

  btnEliminarMesa: {
    marginTop: 6,
    backgroundColor: "#FF4136",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },



  icon: { fontSize: 32 },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2, // para Android
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  edit: { color: "blue" },
  delete: { color: "red" },


  listaReservas: {
    marginTop: 16,
  },

  item: {
    marginBottom: 4,
    fontSize: 14,
  },
  label: {
    fontWeight: 'bold',
  },
  acciones: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingBottom: 25,
  },
  btnEditar: {
    color: 'blue',
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#e0f0ff',
  },
  btnEliminar: {
    color: 'red',
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#ffe0e0',
  },

});
