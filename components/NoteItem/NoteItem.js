import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    useWindowDimensions,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RenderHTML from 'react-native-render-html';
import EmptyNoteMessage from './EmptyNoteMessage';
import { useCallback } from 'react';

export default function NoteItem({
    notes,
    filteredNotes,
    setModalVisible,
    isSelectionMode,
    setIsSelectionMode,
    selectedNotes,
    setSelectedNotes,
    cancelSelection,
    navigation,
}) {
    const { width } = useWindowDimensions();

    const toggleSelect = useCallback(
        (id) => {
            setSelectedNotes((prev) =>
                prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
            );
        },
        [setSelectedNotes]
    );

    const getNoteDetails = (note) => {
        navigation.navigate('NoteDetail', { note });
    };

    const renderItem = useCallback(
        ({ item }) => (
            <TouchableOpacity
                onLongPress={() => {
                    setIsSelectionMode(true);
                    setSelectedNotes([item.id]);
                }}
                onPress={() =>
                    isSelectionMode ? toggleSelect(item.id) : getNoteDetails(item)
                }
                style={styles.itemContainer}
            >
                <View style={styles.noteCard}>
                    <View style={styles.noteContent}>
                        <Text style={styles.title} numberOfLines={1}>
                            {item.title}
                        </Text>

                        <RenderHTML
                            contentWidth={width}
                            source={{
                                html:
                                    item.description.length > 100
                                        ? `${item.description.slice(0, 30)}...`
                                        : item.description,
                            }}
                            baseStyle={styles.previewText}
                            tagsStyles={{ p: styles.previewText }}
                            ignoredDomTags={['img']}
                        />

                        <Text style={styles.date}>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>

                    {isSelectionMode && (
                        <BouncyCheckbox
                            size={24}
                            iconStyle={styles.checkboxIcon}
                            fillColor="green"
                            unfillColor="#fff"
                            isChecked={selectedNotes.includes(item.id)}
                            disableBuiltInState
                            onPress={() => toggleSelect(item.id)}
                            style={styles.checkbox}
                        />
                    )}
                </View>
            </TouchableOpacity>
        ),
        [isSelectionMode, selectedNotes, toggleSelect]
    );

    if (notes.length === 0) return <EmptyNoteMessage
        imageSource={require('../../assets/images/empty-note.png')}
        title="Add your first note."
        description={`Relax and write something\nbeautiful`}
    />;

    return (
        <View style={styles.container}>
            {filteredNotes.length !== 0 && (
                <FlatList
                    data={filteredNotes}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                />
            )}

            {filteredNotes.length === 0 && <EmptyNoteMessage
                imageSource={require('../../assets/images/search-empty.png')}
                title="No results found"
                description={`Try searching with different\nkeywords.`}
            />}

            {isSelectionMode && (
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.deleteButtonText}>
                            ({selectedNotes.length} items)
                        </Text>
                        <Icon name="delete" size={25} color="red" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={cancelSelection}
                    >
                        <Icon name="close" size={25} color="gray" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        marginVertical: 8,
    },
    noteCard: {
        backgroundColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 4,
    },
    noteContent: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
        color: '#000',
    },
    previewText: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
    date: {
        fontSize: 12,
        color: '#666',
        marginTop: 10,
    },
    checkboxIcon: {
        borderRadius: 6,
    },
    checkbox: {
        marginLeft: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f8f8f8',
        padding: 10,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: 12,
        marginRight: 10,
        borderRadius: 8,
    },
    deleteButtonText: {
        fontSize: 16,
        color: 'red',
        fontWeight: 'bold',
        marginRight: 6,
    },
    cancelButton: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        marginLeft: 10,
        borderRadius: 8,
    },
    noResultContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    noResultText: {
        fontSize: 18,
        color: '#999',
        fontWeight: '500',
        textAlign: 'center',
    },
});
