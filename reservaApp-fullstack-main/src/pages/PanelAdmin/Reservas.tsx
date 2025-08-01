import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiSettings, FiTrash } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import type { ReservaForm } from "./reservas.types";
import { eliminarReserva, obtenerReservas } from "./reservas.service";
import { ModalReservas } from "./ModalReservas";
import Swal from "sweetalert2";

const MESAS_KEY = "mesas_reservas_app";

function Reservas() {
  const [reserva, setReserva] = useState<ReservaForm[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [reservaEditar, setReservaEditar] = useState<ReservaForm | undefined>();

  const [mesas, setMesas] = useState<string[]>(() => {
    const saved = localStorage.getItem(MESAS_KEY);

    return saved ? JSON.parse(saved) : ["M1", "M2", "M3", "M4", "M5", "M6"];
  });


  const cargarReservas = async () => {
    try {
      const data = await obtenerReservas();
      setReserva(data);
      console.log("Reservas obtenidas :", data);
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem(MESAS_KEY, JSON.stringify(mesas));
  }, [mesas]); // Cargar reservas al montar el componente

  // Cargar contactos al montar el componente
  useEffect(() => {
    cargarReservas(); //Ejecuta la función cargarMensajes() al montar el componente
  }, []);


  //funcion añadir mesas 
  const plusTable = () => {
    const nextNumber = mesas.length + 1;
    const newTableId = `M${nextNumber}`;
    setMesas([...mesas, newTableId])
    toast.success(`Mesa ${nextNumber} añadida`, {
      position: "top-right",
      autoClose: 1000,
    });

  }

  // Función para el btn eliminar una mesa
  // Si no se pasa un ID, elimina la última mesa
  const deleteTable = () => {
    const mesasDinamicas = mesas
      .filter((m) => parseInt(m.replace("M", "")) > 6)
      .sort((a, b) => parseInt(b.replace("M", "")) - parseInt(a.replace("M", "")));

    if (mesasDinamicas.length === 0) {
      Swal.fire("Sin mesas dinámicas", "No hay mesas agregadas para eliminar.", "info");
      return;
    }

    const ultimaMesa = mesasDinamicas[0];

    // Mapeo de reservas por mesa
    const reservasPorMesa: { [key: string]: ReservaForm[] } = {};
    reserva.forEach((r) => {
      if (!reservasPorMesa[r.tableId]) reservasPorMesa[r.tableId] = [];
      reservasPorMesa[r.tableId].push(r);
    });

    const reservasMesa = reservasPorMesa[ultimaMesa] ?? [];

    if (reservasMesa.length > 0) {
      Swal.fire(
        "Mesa con reservas",
        `No puedes eliminar la ${ultimaMesa} porque tiene ${reservasMesa.length} reserva(s) activa(s).`,
        "warning"
      );
      return;
    }

    setMesas((prev) => prev.filter((m) => m !== ultimaMesa));
    toast.success(`Mesa ${ultimaMesa} eliminada`, {
      position: "top-right",
      autoClose: 1000,
    });
  };


  // Funciones para abrir y cerrar el modal y cargar datos por default
  const abrirModal = (datosParciales?: Partial<ReservaForm>) => {
    const base: ReservaForm = {
      id: 0,
      customerName: "",
      customerPhone: "",
      guests: 1,
      date: "",
      time: "",
      tableId: "",
      status: "Pendiente",
      ...datosParciales, // sobrescribe con lo que le pases, como { tableId: 'M2' }
    };

    setReservaEditar(base);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setReservaEditar(undefined); // Limpia el contacto editando
    setMostrarModal(false);
    cargarReservas();
  };

  const confirmarEliminacion = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Está seguro de eliminar?",
      //text: "No podrá revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      //width: "500px",
    });

    if (result.isConfirmed) {
      await eliminarReserva(id);
      toast.success("Mensaje eliminado", {
        position: "top-right",
        autoClose: 1000,
      });
      // Actualizar la lista de contactos localmente
      setReserva((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-center text-2xl font-bold mb-4">
        Panel de Administrador
      </h2>

      {/* nav header */}
      <div className="flex justify-between items-center mb-4">

        <h3 className="text-left text-emerald-400 text-xl font-bold mb-3">

          Seleccione una Mesa
        </h3>
        {/* btn Añadir Mesa */}
        <div className="flex justify-end items-center mb-4">
          <button className=" flex items-center mb-4">
            <h3 className="mr-3 text-blue-600 font-bold "> Añadir Mesas</h3>
            <FiPlus
              className="text-2xl text-blue-500 hover:text-blue-700 cursor-pointer "
              onClick={() => plusTable()}
            />
          </button>
        </div>
      </div>

      {/* gfrilla para mostrar mesas  */}
      {/* // Sección de mesas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {mesas.map((mesa) => (
          <button
            key={mesa}
            onClick={() => abrirModal({ tableId: mesa })}
            className="flex flex-col items-center justify-center border-2 border-gray-600 text-black-600 px-4 py-6 rounded-xl hover:bg-blue-50 transition shadow"
          >
            <span className="text-4xl">🍽️</span>
            <span className="mt-2 font-semibold">
              Mesa {mesa.replace("M", "")}
            </span>
          </button>
        ))}
      </div>

      {/* Botón para eliminar mesa */}
      <div className="flex justify-end">
        <button className="flex items-center mb-4">
          <h3 className="mr-3 text-red-600 font-bold "> Eliminar Mesa</h3>
          <FiTrash
            className="text-2xl text-orange-500 hover:text-red-700 cursor-pointer"
            onClick={() => deleteTable()} // Elimina la última mesa
          />
        </button>
      </div>

      {/* //tabla para mostrar reservas */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border bg-white border-gray-300 mt-4 rounded-xl shadow">
          <thead>
            <tr className="bg-blue-100">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Nombre</th>
              <th className="text-left px-4 py-2">Telefono</th>
              <th className="text-left px-4 py-2">Personas</th>
              <th className="text-left px-4 py-2">Fecha</th>
              <th className="p-2 text-center">Hora</th>
              <th className="p-2 text-center">Mesa</th>
              <th className="p-2 text-center">Estado</th>
              <th className="p-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  <FiSettings />
                  <span>Opciones</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {reserva.map((m) => (
              <tr key={m.id} className="border-t border-gray-200">
                <td className="px-4 py-2">{m.id}</td>
                <td className="px-4 py-2">{m.customerName}</td>
                <td className="px-4 py-2">{m.customerPhone}</td>
                <td className="px-4 py-2">{m.guests}</td>
                <td className="px-4 py-2">{m.date}</td>
                <td className="px-4 py-2">{m.time}</td>
                <td className="px-4 py-2">{m.tableId}</td>
                <td className="px-4 py-2">{m.status}</td>

                {/* // Botones de acción para editar y eliminar */}
                <td className="p-2 flex justify-center gap-3">
                  <button
                    onClick={() => abrirModal(m)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => confirmarEliminacion(m.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/*Renderiza el Modal  */}
      {mostrarModal && (
        <ModalReservas
          onClose={cerrarModal}
          reservas={reservaEditar}
          todasLasReservas={reserva}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default Reservas;
