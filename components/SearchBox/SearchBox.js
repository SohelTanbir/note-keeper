
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';

const SearchBox = ({ value, onChange, onFocus, onBlur }) => {
    return (
        <View style={styles.container}>
            <Feather name="search" size={20} color={colors.textSecondary} style={styles.icon} />
            <TextInput
                placeholder="Search"
                value={value}
                onChangeText={onChange}
                style={styles.input}
                placeholderTextColor={colors.textSecondary}
                clearButtonMode="always"
                onFocus={onFocus}
                onBlur={onBlur}
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={() => onChange('')}>
                    <Ionicons name="close-circle" size={25} color={colors.textSecondary} />
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
        backgroundColor: colors.bgColor,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 2,
        marginBottom: 12,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.textSecondary,
    },
});
