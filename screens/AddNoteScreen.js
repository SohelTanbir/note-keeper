import React, { useState, useLayoutEffect, useCallback } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { showToast } from '../utils/showToast';

export default function AddNoteScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Memoized save function to avoid recreating on every render
    const saveNote = useCallback(async () => {
        if (!title.trim() || !description.trim()) {
            showToast('error', 'Empty!', 'Please enter a title and description to save.');
            return;
        }

        try {
            const newNote = { id: uuid.v4(), title: title.trim(), description: description.trim(), createdAt: new Date().toISOString() };
            const existing = await AsyncStorage.getItem('notes');
            const notes = existing ? JSON.parse(existing) : [];
            console.log('newNote', newNote);
            notes.push(newNote);
            await AsyncStorage.setItem('notes', JSON.stringify(notes));
            showToast('success', 'Saved!', 'Your note has been saved successfully.');
            navigation.goBack();
        } catch (error) {
            showToast('error', 'Failed!', 'Failed to save the note.');
        }
    }, [title, description]);

    // Header Save button
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={saveNote} style={styles.headerButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, saveNote]);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                placeholderTextColor="#aaa"
            />
            <TextInput
                placeholder="Note something down"
                value={description}
                onChangeText={setDescription}
                style={styles.inputContent}
                placeholderTextColor="#aaa"
                multiline
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    input: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    inputContent: {
        fontSize: 16,
        color: '#333',
        flex: 1,
        textAlignVertical: 'top',
    },
    saveButtonText: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerButton: {
        marginRight: 16,
    },
});
