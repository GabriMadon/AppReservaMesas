import type { ReservaForm, ReservaRequest } from "./reservas.types";
import { useForm } from "react-hook-form";
import { actualizarReserva, enviarReservas } from "./reservas.service";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useHorasDisponibles } from "../../hooks/useHorasDisponibles";

interface Props {
  onClose: () => void;
  reservas?: ReservaForm;
  todasLasReservas: ReservaForm[];
}
//formulario o Modal de reservas
export const ModalReservas = ({ onClose, reservas, todasLasReservas }: Props) => {
  const esEdicion = reservas?.id !== 0; // Verifica si es una edición o creación
  // Configuración del formulario con react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch
  } = useForm<ReservaForm>();

  /* nos muestra el formulario con los datos para poder editarlo */
  useEffect(() => {
    if (reservas) {
      setValue("tableId", reservas.tableId);
      setValue("customerName", reservas.customerName);
      setValue("customerPhone", reservas.customerPhone);
      setValue("guests", reservas.guests);
      setValue("date", reservas.date);
      setValue("time", reservas.time);
      setValue("tableId", reservas.tableId);
      setValue("status", reservas.status);
    } else {
      reset(); // Resetea el formulario si no hay reservas
    }
  }, [reservas, reset, setValue]);

  // Define today's date in 'YYYY-MM-DD' format for validation
  const today = new Date().toISOString().split("T")[0];

  /*onSubmit  Función para enviar el formulario */
  const onSubmit = async (data: ReservaRequest) => {
    try {
      console.log(data);
      if (esEdicion && reservas) {
        await actualizarReserva(
          reservas.id,
          data.customerName,
          data.customerPhone,
          data.guests,
          data.date,
          data.time,
          data.tableId,
          data.status
        );
        toast.success("Reserva actualizada correctamente", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        // Si es una nueva reserva, envía los datos
        // await crearReserva(data);
        await enviarReservas(data);
        toast.success("Contacto creado correctamente", {
          position: "top-right",
          autoClose: 1000,
        });
      }

      reset();
      onClose();
    } catch (err) {
      toast.error("Error al enviar el mensaje", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  
    const horasDisponibles = useHorasDisponibles({
      reservas: todasLasReservas,
      mesa: watch("tableId"), // vinculás al campo seleccionado
      fecha: watch("date"),
      reservaEnEdicion: reservas,
    });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3> Editar Reserva</h3>

        {/* Formulario De cReserva*/}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campos del Formulario */}
          {/* Campo nombres */}
          <div>
            <label className="block font-medium mb-1">Nombre:</label>
            <input
              className="w-full px-3 py-2 border rounded-xl"
              {...register("customerName", {
                required: "El nombre es obligatorio",
              })}
            />
            {errors.customerName && (
              <p className="text-red-500">{errors.customerName.message}</p>
            )}
          </div>
          {/* Campo Telefono */}
          <div>
            <label className="block font-medium mb-1">Teléfono:</label>
            <input
              className="w-full px-3 py-2 border rounded-xl"
              {...register("customerPhone", {
                required: "El teléfono es obligatorio",
              })}
            />
            {errors.customerPhone && (
              <p className="text-red-500">{errors.customerPhone.message}</p>
            )}
          </div>
            {/* Numero de personas invitados */}
          <div>
            <label className="block font-medium mb-1">
              Número de invitados:
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-xl"
              {...register("guests", {
                required: "El número de invitados es obligatorio",
                min: { value: 1, message: "Debe haber al menos 1 invitado" },
              })}
            />
            {errors.guests && (
              <p className="text-red-500">{errors.guests.message}</p>
            )}
          </div>
          {/* Campo Fecha */}
          <div>
            <label className="block font-medium mb-1">Fecha:</label>

            <input
              type="date"
              className="w-full px-3 py-2 border rounded-xl"
              min={today} // Establece la fecha mínima como hoy
              {...register("date", {
                required: "La fecha es obligatoria",
                validate: (value) => value >= today || "Fecha no permitida",
              })}
            />
            {errors.date && (
              <p className="text-red-500">{errors.date.message}</p>
            )}
          </div>

          
          {/* Campo Hora */}
          <div>
            <label className="block font-medium mb-1">Hora:</label>
            <select
              className="w-full px-3 py-2 border rounded-xl"
              {...register("time", {
                required: "La hora es obligatoria",
              })}
            >
              <option value="">Selecciona una hora</option>
              {horasDisponibles.map((hora: string) => (
                <option key={hora} value={hora}>
                  {hora}
                </option>
              ))}
            </select>
            {errors.time && (
              <p className="text-red-500">{errors.time.message}</p>
            )}
          </div>


          {/* Campo Mesa */}
          <div>
            <label className="block font-medium mb-1">Mesa:</label>
            <input
              className="w-full px-3 py-2 border rounded-xl"
              {...register("tableId", {
                required: "La mesa es obligatoria",
              })}
            />
            {errors.tableId && (
              <p className="text-red-500">{errors.tableId.message}</p>
            )}
          </div>
          {/* Campo  Estado de la reserva */}
          <label className="block font-medium mb-1">Estado:</label>
          <select
            className="w-full px-3 py-2 border rounded-xl mb-7"
            {...register("status", { required: "El estado es obligatorio" })}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Activa">Activa</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Finalizada">Finalizada</option>
            {errors.status && (
              <p className="text-red-500">{errors.status.message}</p>
            )}
          </select>

          {/* Botones  formulario */}

          <div className="flex justify-end gap-2">
            {/* boton Cancelar */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              Cancelar
            </button>

            {/* Botón para Actualizar*/}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              {esEdicion ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
function watch(arg0: string): string {
  throw new Error("Function not implemented.");
}

