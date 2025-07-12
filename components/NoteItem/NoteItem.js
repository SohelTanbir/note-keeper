import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    useWindowDimensions
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RenderHTML from 'react-native-render-html';

export default function NoteItem({
    notes,
    setNotes,
    setModalVisible,
    isSelectionMode,
    setIsSelectionMode,
    selectedNotes,
    setSelectedNotes,
    cancelSelection,
    navigation
}) {
    const { width } = useWindowDimensions();

    const toggleSelect = (id) => {
        setSelectedNotes((prev) =>
            prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
        );
    };

    const getNoteDetails = (note) => {
        navigation.navigate('NoteDetail', { note });
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={notes}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
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
                            <View style={{ flex: 1 }}>
                                <Text style={styles.title}>{item.title}</Text>

                                {/* Render rich HTML content preview */}
                                <RenderHTML
                                    contentWidth={width}
                                    source={{ html: item.description }}
                                    baseStyle={styles.previewText}
                                    tagsStyles={{
                                        p: { fontSize: 14, color: '#333' },
                                    }}
                                    ignoredDomTags={['img']}
                                />

                                <Text style={styles.date}>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </Text>
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
                ListEmptyComponent={
                    <View style={styles.emptyMessageContainer}>
                        <Text style={styles.emptyMessageText}>No matching notes found.</Text>
                    </View>
                }
            />

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
    noteCard: {
        backgroundColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 4,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 4,
        fontSize: 16,
        color: '#000',
    },
    previewText: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
    checkbox: {
        fontSize: 20,
        marginRight: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f8f8f8',
        width: '100%',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
    },
    deleteButtonText: {
        fontSize: 16,
        color: 'red',
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    emptyMessageContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    emptyMessageText: {
        color: '#999',
        fontSize: 16,
        fontStyle: 'italic',
    },
    date: {
        color: '#666',
        fontSize: 12,
        marginTop: 10,
    },
});
