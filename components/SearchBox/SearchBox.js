
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const SearchBox = ({ value, onChange }) => {
    return (
        <View style={styles.container}>
            <Feather name="search" size={20} color="#888" style={styles.icon} />
            <TextInput
                placeholder="Search"
                value={value}
                onChangeText={onChange}
                style={styles.input}
                placeholderTextColor="#999"
                clearButtonMode="always"
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={() => onChange('')}>
                    <Ionicons name="close-circle" size={25} color="#999" />
                </TouchableOpacity>
            )}
        </View>
    );
};
export default SearchBox;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginBottom: 12,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
});
