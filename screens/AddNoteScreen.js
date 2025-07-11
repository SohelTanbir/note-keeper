import React, { useState, useLayoutEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export default function AddNoteScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const saveNote = async () => {
        if (!title || !description) {
            Alert.alert('Please fill in both fields.');
            return;
        }
        try {
            const newNote = { id: uuid.v4(), title, description };
            const existing = await AsyncStorage.getItem('notes');
            const notes = existing ? JSON.parse(existing) : [];
            notes.push(newNote);
            await AsyncStorage.setItem('notes', JSON.stringify(notes));
            navigation.goBack();
        } catch (err) {
            console.error('Saving note failed', err);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={saveNote}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, title, description]);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />
            <TextInput
                placeholder="Note something down"
                value={description}
                onChangeText={setDescription}
                style={styles.inputContent}
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
        fontFamily: 'Roboto',
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
    inputContent: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: '#333',
        backgroundColor: 'transparent',
        marginBottom: 5,
    },
    saveButtonText: {
        fontFamily: 'Roboto',
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
