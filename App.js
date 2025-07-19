import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import AddNoteScreen from './screens/AddNoteScreen';
import NoteDetailsScreen from './screens/NoteDetailsScreen';
const Stack = createNativeStackNavigator();
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <>
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
