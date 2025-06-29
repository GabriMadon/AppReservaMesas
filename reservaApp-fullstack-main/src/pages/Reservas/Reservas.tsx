import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiSettings, FiTrash } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import type { ReservaForm } from "./reservas.types";
import { eliminarReserva, obtenerReservas } from "./reservas.service";
import { ModalReservas } from "./ModalReservas";
import Swal from "sweetalert2";

function Reservas() {
  const [reserva, setReserva] = useState<ReservaForm[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false); // Estado para controlar la visibilidad del modal

  const [reservaEditar, setReservaEditar] = useState<ReservaForm | undefined>();

  const cargarReservas = async () => {
    try {
      const data = await obtenerReservas();
      setReserva(data);
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
    }
  };

  // Cargar contactos al montar el componente
  useEffect(() => {
    cargarReservas(); //Ejecuta la función cargarMensajes() al montar el componente
  }, []);

  // Funciones para abrir y cerrar el modal
  const abrirModal = (datosParciales?: Partial<ReservaForm>) => {
    const base: ReservaForm = {
      id: 0,
      customerName: "",
      customerPhone: "",
      guests: 1,
      date: "",
      time: "",
      tableId: "",
      status: "Activa",
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
      {/*     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Módulo Reservas
        </h1>
        <button
          onClick={() => abrirModal({})}
          className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        >
          <FiPlus />
          Agregar Reserva
        </button>
      </div> */}

      {/* gfrilla para mostrar mesas  */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {["M1", "M2", "M3", "M4", "M5", "M6"].map((mesa) => (
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
                    <FiSettings  />
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
      {/*Renderiza el Modal para agregar un nuevo contacto */}

      {mostrarModal && (
        <ModalReservas onClose={cerrarModal} reservas={reservaEditar} />
      )}
      <ToastContainer />
    </div>
  );
}

export default Reservas;
