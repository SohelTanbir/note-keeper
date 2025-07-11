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
            setNotes(json ? JSON.parse(json) : []);
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
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']} >
            <SearchBox value={query} onChange={setQuery} />
            <NoteItem
                notes={filteredNotes}
                setNotes={setNotes}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                setIsSelectionMode={setIsSelectionMode}
                isSelectionMode={isSelectionMode}
                selectedNotes={selectedNotes}
                setSelectedNotes={setSelectedNotes}
                cancelSelection={cancelSelection}
                navigation={navigation}
            />

            <ConfirmActionModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                confirmDelete={confirmDelete}
                selectedNotes={selectedNotes}
            />

            <View style={styles.addNoteButtonContainer}>
                <TouchableOpacity style={styles.addNoteButton}>
                    <Icon name="add-circle" size={50} color="#4CAF50"
                        onPress={() => navigation.navigate('AddNote')}
                    />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    addNoteButtonContainer: {
        position: 'absolute',
        bottom: 80,
        right: 10,
        zIndex: 10,
    },
});
