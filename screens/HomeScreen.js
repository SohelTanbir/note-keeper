import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
    const [notes, setNotes] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        const loadNotes = async () => {
            const json = await AsyncStorage.getItem('notes');
            setNotes(json ? JSON.parse(json) : []);
        };
        if (isFocused) loadNotes();
    }, [isFocused]);

    // get note details
    const getNoteDetails = (note) => {
        navigation.navigate('NoteDetail', { note: note });
    };

    return (
        <View style={styles.container}>
            <Button title="New Note" onPress={() => navigation.navigate('AddNote')} />
            <FlatList
                data={notes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => getNoteDetails(item)} style={styles.note}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text>{item.content}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    note: { backgroundColor: '#fff', padding: 15, marginVertical: 8, borderRadius: 8 },
    title: { fontWeight: 'bold', marginBottom: 5 },
});
