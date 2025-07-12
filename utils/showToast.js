import Toast from 'react-native-toast-message';

export const showToast = (type = 'success', title = '', message = '') => {
    Toast.show({
        type,
        text1: title,
        text2: message,
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 50,
        text1Style: {
            fontSize: 16,
        },
        text2Style: {
            fontSize: 14,
        },
    });
};
