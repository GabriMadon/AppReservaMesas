import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Login from './Login/Login';
import PanelAdmin from './PanelAdmi/PanelAdmin';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Iniciar Sesión" component={Login} />
        <Stack.Screen name="PanelAdmin" component={PanelAdmin}

          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={async () => {

                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Iniciar Sesión' }],
                  });

                  console.log('Sesión cerrada');
                }}
                style={{
                  backgroundColor: '#d32f2f',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                  marginRight: 10
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Logout</Text>
              </TouchableOpacity>
            ),
            headerTitle: 'Panel Admin',
          })}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
