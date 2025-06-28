import { View, Text, StyleSheet, Modal, Button, TouchableOpacity } from 'react-native'


export default function ConfirmActionModal({ modalVisible, setModalVisible, confirmDelete, selectedNotes }) {
    return (
        <Modal visible={modalVisible} transparent animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalBox}>
                    <Text style={styles.modalText}>Are you sure you want to delete?</Text>
                    <Text style={styles.modalSubText}>You won’t be able to revert.</Text>
                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalCancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalConfirmButton}
                            onPress={confirmDelete}
                            disabled={selectedNotes.length === 0}
                        >
                            <Text style={styles.modalConfirmButtonText}>Delete</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 5,
    },
    modalSubText: {
        marginBottom: 15,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#333',
        paddingBottom: 10,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
    },
    modalConfirmButton: {
        marginHorizontal: 5,
        backgroundColor: 'green',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        opacity: 1,
    },
    modalConfirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },

    modalCancelButton: {
        marginHorizontal: 5,
        backgroundColor: 'red',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        opacity: 1,
    },
    modalCancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },

});
