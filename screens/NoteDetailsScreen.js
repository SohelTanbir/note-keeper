import React, { useState, useRef, useLayoutEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Text,
    Alert,
} from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function NoteDetailsScreen({ route, navigation }) {
    const { note } = route.params;
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.description);
    const richText = useRef();

    const updateNote = async () => {
        const htmlContent = await richText.current?.getContentHtml();
        if (!title.trim() || !htmlContent.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Both title and content are required.',
            });
            return;
        }

        try {
            const storedNotes = await AsyncStorage.getItem('notes');
            const notes = storedNotes ? JSON.parse(storedNotes) : [];

            const updatedNotes = notes.map((item) =>
                item.id === note.id
                    ? { ...item, title: title.trim(), description: htmlContent.trim() }
                    : item
            );

            await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));

            Toast.show({ type: 'success', text1: 'Note Updated!' });
            navigation.goBack();
        } catch (err) {
            console.error('Update failed:', err);
            Alert.alert('Error', 'Failed to update the note.');
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={updateNote} style={{ marginRight: 16 }}>
                    <Text style={styles.saveText}>Update</Text>
                </TouchableOpacity>
            ),
        });
    }, [title, content]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Note Title"
            />

            <View style={styles.editorContainer}>
                <RichToolbar
                    editor={richText}
                    actions={[
                        actions.setBold,
                        actions.setItalic,
                        actions.setUnderline,
                        actions.insertOrderedList,
                        actions.insertBulletsList,
                        actions.setStrikethrough,
                        actions.insertLink,
                    ]}
                    selectedIconTint="#4CAF50"
                    style={styles.richToolbar}
                />

                <RichEditor
                    ref={richText}
                    initialContentHTML={note.description}
                    onChange={setContent}
                    placeholder="Edit your content..."
                    style={styles.richEditor}
                    initialHeight={250}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    titleInput: {
        fontSize: 20,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingBottom: 8,
        marginBottom: 12,
        color: '#333',
    },
    editorContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
    },
    richToolbar: {
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    richEditor: {
        flex: 1,
        padding: 10,
    },
    saveText: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
