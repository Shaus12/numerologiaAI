import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    TouchableOpacityProps,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    style,
    ...props
}) => {
    if (variant === 'primary') {
        return (
            <TouchableOpacity activeOpacity={0.8} style={[styles.container, style]} {...props}>
                <LinearGradient
                    colors={Colors.goldGradient as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                >
                    <Text style={styles.primaryText}>{title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[
                styles.container,
                variant === 'secondary' ? styles.secondary : styles.outline,
                style,
            ]}
            {...props}
        >
            <Text
                style={[
                    styles.text,
                    variant === 'outline' ? styles.outlineText : styles.secondaryText,
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
        overflow: 'hidden',
        height: 56,
        marginVertical: 10,
        justifyContent: 'center',
    },
    gradient: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryText: {
        ...Typography.body,
        color: '#0a0612',
        fontWeight: '700',
        fontSize: 18,
    },
    secondary: {
        backgroundColor: Colors.surface,
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    secondaryText: {
        ...Typography.body,
        color: Colors.text,
        fontWeight: '600',
    },
    outline: {
        borderWidth: 1,
        borderColor: Colors.primary,
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    outlineText: {
        ...Typography.body,
        color: Colors.primary,
        fontWeight: '600',
    },
    text: {
        fontSize: 18,
    },
});
