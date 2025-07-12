import React, { useRef, useState, useLayoutEffect } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { showToast } from '../utils/showToast'; // optional
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddNoteScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const richText = useRef();

    const saveNote = async () => {
        const htmlContent = await richText.current?.getContentHtml();

        if (!title.trim() || !htmlContent.trim()) {
            showToast('error', 'Missing fields', 'Please enter both title and note.');
            return;
        }

        const newNote = {
            id: uuid.v4(),
            title: title.trim(),
            description: htmlContent,
            createdAt: new Date().toISOString(),
        };

        const existing = await AsyncStorage.getItem('notes');
        const notes = existing ? JSON.parse(existing) : [];
        notes.push(newNote);
        await AsyncStorage.setItem('notes', JSON.stringify(notes));
        showToast('success', 'Note Saved', 'Your note was saved successfully.');
        navigation.goBack();
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={saveNote} style={{ marginRight: 16 }}>
                    <Text style={styles.headerSaveText}>Save</Text>
                </TouchableOpacity>
            ),
        });
    }, [title]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    <TextInput
                        placeholder="Title"
                        style={styles.titleInput}
                        value={title}
                        onChangeText={setTitle}
                    />

                    <RichEditor
                        ref={richText}
                        placeholder="Write your note here..."
                        style={styles.richEditor}
                        initialHeight={200}
                    />

                    <RichToolbar
                        editor={richText}
                        actions={[
                            actions.setBold,
                            actions.setItalic,
                            actions.setUnderline,
                            actions.insertBulletsList,
                            actions.insertOrderedList,
                            actions.insertLink,
                            actions.setStrikethrough,
                        ]}
                        style={styles.richToolbar}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    titleInput: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    richEditor: {
        flex: 1,
        padding: 16,
    },
    richToolbar: {
        backgroundColor: '#f2f2f2',
    },
    headerSaveText: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
