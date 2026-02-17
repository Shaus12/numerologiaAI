import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

interface GradientBackgroundProps extends ViewProps {
    children: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, style, ...props }) => {
    return (
        <LinearGradient
            colors={Colors.gradient as any}
            style={[styles.container, style]}
            {...props}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
