import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../utils/colors';

export default function EmptyState({
    imageSource,
    title,
    description,
    style,
}) {
    return (
        <View style={[styles.container, style]}>
            <Image source={imageSource} style={styles.image} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 20,
    },
    image: {
        width: 250,
        height: 250,
        resizeMode: 'contain', // or 'cover', depending on your need
        marginBottom: 16, // optional spacing
    },

    title: {
        fontFamily: 'Roboto',
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    description: {
        fontFamily: 'Roboto',
        color: colors.disabled,
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
    },
});
