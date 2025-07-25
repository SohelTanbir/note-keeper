import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ConfirmActionModal from '../components/Modals/ConfirmModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBox from '../components/SearchBox/SearchBox';
import NoteItem from '../components/NoteItem/NoteItem';
import { colors } from '../utils/colors';




export default function HomeScreen({ navigation }) {
    const [notes, setNotes] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [query, setQuery] = useState('');
    const isFocused = useIsFocused();

    useEffect(() => {
        const loadNotes = async () => {
            const json = await AsyncStorage.getItem('notes');
            const loadedNotes = json ? JSON.parse(json) : [];

            // Sort by newest (assuming 'createdAt' or 'updatedAt' is available)
            const sortedNotes = loadedNotes.sort((a, b) => {
                const dateA = new Date(b.updatedAt || b.createdAt || 0);
                const dateB = new Date(a.updatedAt || a.createdAt || 0);
                return dateA - dateB;
            });

            setNotes(sortedNotes);
        };

        if (isFocused) loadNotes();
    }, [isFocused]);


    // Function to confirm deletion of selected notes
    const confirmDelete = async () => {
        const updatedNotes = notes.filter((note) => !selectedNotes.includes(note.id));
        setNotes(updatedNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
        setIsSelectionMode(false);
        setSelectedNotes([]);
        setModalVisible(false);
    };

    // Function to cancel selection mode
    const cancelSelection = () => {
        setIsSelectionMode(false);
        setSelectedNotes([]);
    };

    // search notes
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.description.toLowerCase().includes(query.toLowerCase())

    );

    return (
        <>
            <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']} >
                {notes.length > 0 && (
                    <SearchBox value={query} onChange={setQuery} />
                )}
                <NoteItem
                    notes={notes}
                    setNotes={setNotes}
                    filteredNotes={filteredNotes}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    setIsSelectionMode={setIsSelectionMode}
                    isSelectionMode={isSelectionMode}
                    selectedNotes={selectedNotes}
                    setSelectedNotes={setSelectedNotes}
                    cancelSelection={cancelSelection}
                    navigation={navigation}
                />


                <View style={styles.addNoteButtonContainer}>
                    <TouchableOpacity
                        style={styles.addNoteButton}
                        onPress={() => navigation.navigate('AddNote')}
                    >
                        <Icon name="add" size={30} color={colors.primary} />
                    </TouchableOpacity>
                </View>


            </SafeAreaView>

            <ConfirmActionModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                confirmDelete={confirmDelete}
                selectedNotes={selectedNotes}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.white,
    },
    addNoteButtonContainer: {
        position: 'absolute',
        bottom: 100,
        right: 10,
        zIndex: 10,
    },
    addNoteButton: {
        backgroundColor: colors.white,
        borderRadius: 30,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',

        // iOS shadow
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        // Android shadow
        elevation: 5,
    },
});
