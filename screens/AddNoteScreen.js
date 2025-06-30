import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';


export default function AddNoteScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const saveNote = async () => {
        try {
            const newNote = { id: uuid.v4(), title, content };
            const existing = await AsyncStorage.getItem('notes');
            const notes = existing ? JSON.parse(existing) : [];
            notes.push(newNote);
            await AsyncStorage.setItem('notes', JSON.stringify(notes));
            console.log("Note saved.");
            navigation.goBack();
        } catch (err) {
            console.error("Saving note failed", err);
        }
    };


    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />
            <TextInput
                placeholder="Content"
                value={content}
                onChangeText={setContent}
                style={[styles.input, { height: 100 }]}
                multiline
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
                <Text style={styles.saveButtonText}>Save Note</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 15,
        borderRadius: 6,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
