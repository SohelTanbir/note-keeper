import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync(); // Keep splash screen visible

import HomeScreen from './screens/HomeScreen';
import AddNoteScreen from './screens/AddNoteScreen';
import NoteDetailsScreen from './screens/NoteDetailsScreen';
const Stack = createNativeStackNavigator();
import Toast from 'react-native-toast-message';
import { StatusBar } from 'react-native';
import { colors } from './utils/colors';

export default function App() {

  useEffect(() => {
    const prepare = async () => {
      // Preload fonts, data, or do any startup logic here
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate loading
      await SplashScreen.hideAsync(); // Hide splash screen when ready
    };
    prepare();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Notes' }} />
          <Stack.Screen name="AddNote" component={AddNoteScreen} options={{ title: 'Create Note' }} />
          <Stack.Screen name="NoteDetail" component={NoteDetailsScreen} options={{ title: ' Details Note' }} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>

  );
}
