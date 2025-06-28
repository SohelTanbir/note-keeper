import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import AddNoteScreen from './screens/AddNoteScreen';
import NoteDetailsScreen from './screens/NoteDetailsScreen';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Your Notes' }} />
        <Stack.Screen name="AddNote" component={AddNoteScreen} options={{ title: 'Create Note' }} />
        <Stack.Screen name="NoteDetail" component={NoteDetailsScreen} options={{ title: ' Details Note' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
