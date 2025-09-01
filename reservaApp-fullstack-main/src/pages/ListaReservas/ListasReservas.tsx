import React, { useEffect, useState } from 'react'
import type { ReservaForm } from '../PanelAdmin/reservas.types'
import { obtenerReservas } from '../PanelAdmin/reservas.service';


export const ListasReservas = () => {

    const [reservas, setReservas] = useState<ReservaForm[]>([]);

    useEffect(() => {
        const cargar = async () => {
            const data = await obtenerReservas();
            console.log("Reservas obtenidas:", data);
            setReservas(data);
        }
        cargar();
    }, []);

    const hoyDate = new Date(); // ← fecha actual como objeto
    const hoy = hoyDate.toISOString().split("T")[0]; // string 'YYYY-MM-DD'

    const limiteDate = new Date(hoyDate); // ← copia del objeto
    limiteDate.setDate(hoyDate.getDate() + 6); // suma 6 días
    const limite = limiteDate.toISOString().split("T")[0]; // también 'YYYY-MM-DD'

    const reservasSemanal = reservas.filter((r) => {
        return r.date >= hoy && r.date <= limite;
    });


    return (
        <div className="mt-6 p-4 rounded-xl shadow-md border bg-white">
            <h1 className='text-xl font-bold w-full mb-4 '>Lista Reservas - Todas las Reservas</h1>

            <div>
                <table className="w-full table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Mesa</th>
                            <th className="px-4 py-2 text-left">Fecha</th>
                            <th className="px-4 py-2 text-left">Hora</th>
                            <th className="px-4 py-2 text-left">Mesa</th>
                            <th className="px-4 py-2 text-left">Estado</th>
                        </tr>

                    </thead>
                    <tbody>
                        {reservasSemanal.length > 0 ? (
                            reservasSemanal.map((r) => (
                                <tr key={r.id} className='border-t'>
                                    <td>{r.customerName}</td>
                                    <td>{r.date}</td>
                                    <td>{r.time}</td>
                                    <td>{r.tableId}</td>
                                    <td>{r.status}</td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-3 text-gray-500">
                                    No hay reservas programadas para esta semana
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>

            </div>


        </div>
    )
}
