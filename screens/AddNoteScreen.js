import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';


export default function AddNoteScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const saveNote = async () => {
        try {
            const newNote = { id:uuid.v4(), title, content };
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
            <Button title="Save Note" onPress={saveNote} />
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
});
