import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    TextInput,
} from 'react-native';
import { crearOActualizarReserva } from './reservas.services';
import type { ReservaForm } from './reserva.types';

interface ModalReservasProps {
    onClose: () => void;
    reservas: ReservaForm | null;
    todasLasReservas: ReservaForm[];
}

export const Modalreservas = ({
    onClose,
    reservas,
    todasLasReservas
}: ModalReservasProps) => {
    const [formulario, setFormulario] = useState<ReservaForm | null>(null);
    const [mostrarMenuFecha, setMostrarMenuFecha] = useState(false);
    const [mostrarMenuHora, setMostrarMenuHora] = useState(false);
    const [mostrarMenuEstado, setMostrarMenuEstado] = useState(false);

    const estadosReserva = ["Pendiente", "Activa", "Cancelada", "Finalizada"];

    const hoy = new Date();
    const fechasDisponibles = Array.from({ length: 7 }, (_, i) => {
        const f = new Date();
        f.setDate(hoy.getDate() + i);
        return f.toISOString().split('T')[0];
    });

    const HORAS_DISPONIBLES = Array.from({ length: 12 }, (_, i) => {
        const hora = 12 + i;
        return `${String(hora).padStart(2, '0')}:00`;
    });

    useEffect(() => {
        if (reservas) {
            setFormulario(reservas);
        }
    }, [reservas]);

    const actualizarCampo = (campo: keyof ReservaForm, valor: string | number) => {
        if (!formulario) return;
        setFormulario({ ...formulario, [campo]: String(valor) });
    };
    /* Guardar Reserva */
    const guardarReserva = async () => {
        if (!formulario) return;
        const reservaFinal = {
            ...formulario,

        };


        /* Validacion fechas */
        const hoyStr = new Date().toISOString().split("T")[0];

        const limiteStr = new Date();
        limiteStr.setDate(new Date().getDate() + 7);
        const fechaLimiteStr = limiteStr.toISOString().split("T")[0];

        // Validación por cadenas
        if (formulario.date < hoyStr) {
            alert("La fecha no puede ser anterior a hoy");
            return;
        }

        if (formulario.date > fechaLimiteStr) {
            alert("Solo puedes reservar dentro de los próximos 7 días");
            return;
        }






        const [h, m] = formulario.time.split(':').map(Number);
        if (isNaN(h) || isNaN(m) || h < 12 || h > 23) {
            alert('La hora debe estar entre 12h00 y 23h00');
            return;
        }

        const yaReservada = todasLasReservas.find((r: ReservaForm) =>
            r.tableId === reservaFinal.tableId &&
            r.date === reservaFinal.date &&
            r.time === reservaFinal.time
        );

        if (yaReservada && reservaFinal.id === 0) {
            alert(`La mesa ${reservaFinal.tableId} ya está reservada para esa hora`);
            return;
        }



        await crearOActualizarReserva(reservaFinal);
        onClose();
    };

    if (!formulario) return null;

    return (
        <Modal animationType="slide" transparent={true} visible={true}>
            <View style={styles.overlay}>
                <ScrollView contentContainerStyle={styles.modal}>
                    <Text style={styles.title}>Formulario de Reserva</Text>
                    {/* Campos del formulario */}
                    {/* Campo nombre */}
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        value={formulario.customerName}
                        onChangeText={(text) => actualizarCampo('customerName', text)}
                    />

                    {/* Campo telefono */}
                    <TextInput
                        style={styles.input}
                        placeholder="Teléfono"
                        keyboardType="phone-pad"
                        value={formulario.customerPhone}
                        onChangeText={(text) => actualizarCampo('customerPhone', text)}
                    />
                    {/* Campo personas */}
                    <TextInput
                        style={styles.input}
                        placeholder="Cantidad de personas"
                        keyboardType="number-pad"
                        value={formulario.guests ? String(formulario.guests) : ""}
                        onChangeText={(text) => {
                            // Guardamos el texto temporalmente
                            actualizarCampo("guests", text);
                        }}
                    />

                    {/* Campo Fecha (select táctil) */}
                    <TouchableOpacity onPress={() => setMostrarMenuFecha(!mostrarMenuFecha)} style={styles.selector}>
                        <Text>{formulario.date || 'Seleccionar fecha'}</Text>
                    </TouchableOpacity>
                    {mostrarMenuFecha && (
                        <View style={styles.dropdown}>
                            {fechasDisponibles.map((fecha) => (
                                <TouchableOpacity
                                    key={fecha}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        actualizarCampo('date', fecha);
                                        setMostrarMenuFecha(false);
                                    }}
                                >
                                    <Text>{fecha}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Campo Hora (select táctil) */}
                    <TouchableOpacity onPress={() => setMostrarMenuHora(!mostrarMenuHora)} style={styles.selector}>
                        <Text>{formulario.time || 'Seleccionar hora'}</Text>
                    </TouchableOpacity>
                    {mostrarMenuHora && (
                        <View style={styles.dropdown}>
                            {HORAS_DISPONIBLES.map((hora) => (
                                <TouchableOpacity
                                    key={hora}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        actualizarCampo('time', hora);
                                        setMostrarMenuHora(false);
                                    }}
                                >
                                    <Text>{hora}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    {/* Campo Mesa */}
                    <TextInput
                        style={styles.input}
                        placeholder="Mesa"
                        value={formulario.tableId}
                        onChangeText={(text) => actualizarCampo('tableId', text)}
                    />

                    {/* Campo estado */}
                    <TouchableOpacity
                        style={styles.selector}
                        onPress={() => setMostrarMenuEstado(!mostrarMenuEstado)}
                    >
                        <Text>{formulario.status || "Seleccionar estado"}</Text>
                    </TouchableOpacity>

                    {mostrarMenuEstado && (
                        <View style={styles.dropdown}>
                            {estadosReserva.map((estado) => (
                                <TouchableOpacity
                                    key={estado}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        actualizarCampo("status", estado);
                                        setMostrarMenuEstado(false);
                                    }}
                                >
                                    <Text>{estado}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* botones Accion formulario */}
                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={guardarReserva} style={styles.btnGuardar}>
                            <Text style={styles.btnText}>Guardar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} style={styles.btnCancelar}>
                            <Text style={styles.btnText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        marginHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#888',
        padding: 10,
        marginVertical: 6,
        borderRadius: 8,
    },
    selector: {
        borderWidth: 1,
        borderColor: '#888',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginVertical: 6,
    },
    dropdown: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginBottom: 8,
        paddingHorizontal: 6,
    },
    dropdownItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    btnGuardar: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 8,
    },
    btnCancelar: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 8,
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

