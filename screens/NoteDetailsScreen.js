import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Platform,
    Keyboard,
    ScrollView,
    KeyboardAvoidingView,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../utils/colors';

export default function NoteDetailsScreen({ route, navigation }) {
    const { note } = route.params;
    const [title, setTitle] = useState(note.title);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const richText = useRef();
    const TOOLBAR_HEIGHT = 50;

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
            title: 'Details',
            headerRight: () => (
                <TouchableOpacity onPress={updateNote} style={{ marginRight: 16 }}>
                    <Text style={styles.saveText}>Update</Text>
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
                            initialContentHTML={note.description}
                            placeholder="Edit your content..."
                            style={styles.richEditor}
                            initialHeight={300}
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
                                actions.insertOrderedList,
                                actions.insertBulletsList,
                                actions.setStrikethrough,
                            ]}
                            iconTint={colors.textSecondary}
                            selectedIconTint={colors.primary}
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
        backgroundColor: colors.white,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    titleInput: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        paddingBottom: 8,
        color: colors.textSecondary,
    },
    richEditor: {
        flex: 1,
        minHeight: 200,
    },
    toolbarWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: colors.primary,
        borderTopWidth: 1,
        borderTopColor: colors.disabled,
    },
    richToolbar: {
        height: '100%',
    },
    saveText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
