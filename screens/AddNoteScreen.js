import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showToast } from '../utils/showToast';

export default function AddNoteScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const richText = useRef();
    const TOOLBAR_HEIGHT = 50;

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

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hideSub = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={styles.container}>
                    <TextInput
                        placeholder="Title"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.titleInput}
                    />

                    <ScrollView
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: keyboardHeight + TOOLBAR_HEIGHT,
                        }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <RichEditor
                            ref={richText}
                            placeholder="Write your note here..."
                            initialHeight={300}
                            style={styles.richEditor}
                        />
                    </ScrollView>

                    <View
                        style={[
                            styles.toolbarWrapper,
                            {
                                bottom: keyboardHeight,
                                height: TOOLBAR_HEIGHT,
                            },
                        ]}
                    >
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
                            iconTint="#333"
                            selectedIconTint="#4CAF50"
                            style={styles.richToolbar}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    titleInput: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    richEditor: {
        flex: 1,
        minHeight: 200,
    },
    toolbarWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: '#f2f2f2',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    richToolbar: {
        height: '100%',
    },
    headerSaveText: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
