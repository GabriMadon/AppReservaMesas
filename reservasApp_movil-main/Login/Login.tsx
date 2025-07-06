import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { login } from './login.service';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  PanelAdmin: undefined;

};


export default function Login() {
  type NewType = RootStackParamList;

  const navigation = useNavigation<NativeStackNavigationProp<NewType>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  


  const handleLogin = async () => {
  setMensaje('Iniciando sesión...');

  try {
    const user = await login(email, password);

    
    if ((user as { ok: boolean }).ok) {
      navigation.replace('PanelAdmin'); // redirige al panel principal
    } else {
      setMensaje('Credenciales incorrectas');
    }
  } catch (error) {
    setMensaje('Error de conexión');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Reservar Mesas</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      
      <Button title="Ingresar" onPress={handleLogin} />

      {mensaje !== '' && <Text style={styles.mensaje}>{mensaje}</Text>}

      <Text  style={styles.mensaje2 }>email: admin@reservas.com - password: 123456</Text>
    </View>
  );
}

const styles = StyleSheet.create({

  mensaje2:{
    marginTop: 3,
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  container: {
    flex: 1, // Ocupa toda la pantalla
    justifyContent: 'center', // Centrado vertical
    alignItems: 'center',     // Centrado horizontal
    padding: 20,
    backgroundColor: '#f2f2f2',
    marginBottom: 200, // Espacio inferior para evitar corte en dispositivos pequeños
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1976D2',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  mensaje: {
    marginTop: 20,
    color: '#444',
  },
});
