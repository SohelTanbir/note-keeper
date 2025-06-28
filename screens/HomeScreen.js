import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Button,
    StyleSheet,
    TouchableOpacity,
    Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import ConfirmActionModal from '../components/Modals/ConfirmModal';



export default function HomeScreen({ navigation }) {
    const [notes, setNotes] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const isFocused = useIsFocused();

    useEffect(() => {
        const loadNotes = async () => {
            const json = await AsyncStorage.getItem('notes');
            setNotes(json ? JSON.parse(json) : []);
        };
        if (isFocused) loadNotes();
    }, [isFocused]);

    const toggleSelect = (id) => {
        setSelectedNotes((prev) =>
            prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
        );
    };

    const confirmDelete = async () => {
        const updatedNotes = notes.filter((note) => !selectedNotes.includes(note.id));
        setNotes(updatedNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
        setIsSelectionMode(false);
        setSelectedNotes([]);
        setModalVisible(false);
    };

    const cancelSelection = () => {
        setIsSelectionMode(false);
        setSelectedNotes([]);
    };

    const getNoteDetails = (note) => {
        navigation.navigate('NoteDetail', { note });
    };

    return (
        <View style={styles.container}>
            <Button title="New Note" onPress={() => navigation.navigate('AddNote')} />

            <FlatList
                data={notes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onLongPress={() => {
                            setIsSelectionMode(true);
                            setSelectedNotes([item.id]);
                        }}
                        onPress={() => {
                            if (isSelectionMode) {
                                toggleSelect(item.id);
                            } else {
                                getNoteDetails(item);
                            }
                        }}
                        style={{ marginVertical: 8 }}
                    >
                        <View style={styles.noteCard}>
                            <View>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text numberOfLines={2}>{item.content}</Text>
                            </View>
                            {isSelectionMode && (
                                <BouncyCheckbox
                                    size={24}
                                    iconStyle={{ borderRadius: 6 }}
                                    fillColor="green"
                                    unfillColor="#FFFFFF"
                                    text=""
                                    isChecked={selectedNotes.includes(item.id)}
                                    disableBuiltInState
                                    onPress={() => toggleSelect(item.id)}
                                    style={{ marginRight: 10 }}
                                />

                            )}

                        </View>
                    </TouchableOpacity>
                )}
            />

            {isSelectionMode && (
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.deleteButtonText}>🗑 Delete ({selectedNotes.length})</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={cancelSelection}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ConfirmActionModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                confirmDelete={confirmDelete}
                selectedNotes={selectedNotes}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    noteCard: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'start',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 8,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    checkbox: {
        fontSize: 20,
        marginRight: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: 'gray',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
