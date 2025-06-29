
import type { ReservaForm, ReservaRequest } from "./reservas.types";
import { useForm } from "react-hook-form";
import { actualizarReserva, enviarReservas } from "./reservas.service";
import { toast } from "react-toastify";
import { useEffect } from "react";

interface Props {
  onClose: () => void;
  reservas?: ReservaForm;
}

export const ModalReservas = ({ onClose, reservas }: Props) => {

  const esEdicion = reservas?.id !== 0; // Verifica si es una edición o creación
  // Configuración del formulario con react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
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
  }, [reservas, setValue]);

  /* Función para enviar el formulario */
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
        // Aquí deberías implementar la lógica para crear una nueva reserva si es necesario
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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3> Editar Reserva</h3>

        {/* Formulario De contacto */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campos del Formulario */}
          <div>
            <label className="block font-medium mb-1">Nombre:</label>
            <input
              className="w-full px-3 py-2 border rounded-xl"
              {...register("customerName", { required: "El nombre es obligatorio" })}
            />
            {errors.customerName && (
              <p className="text-red-500">{errors.customerName.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Teléfono:
            </label>
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

          <div>
            <label className="block font-medium mb-1">Número de invitados:</label>
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

          <div>
            <label className="block font-medium mb-1">Fecha:</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-xl"
              {...register("date", {
                required: "La fecha es obligatoria",
              })}
            />
            {errors.date && (
              <p className="text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Hora:</label>
            <input
              type="time"
              className="w-full px-3 py-2 border rounded-xl"
              {...register("time", {
                required: "La hora es obligatoria",
              })}
            />
            {errors.time && (
              <p className="text-red-500">{errors.time.message}</p>
            )}
          </div>

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

          <div>
            <label className="block font-medium mb-1">Estado:</label>
            <input
              className="w-full px-3 py-2 border rounded-xl"
              {...register("status", {
                required: "El estado es obligatorio",
              })}
            />
            {errors.status && (
              <p className="text-red-500">{errors.status.message}</p>
            )}
          </div>
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
