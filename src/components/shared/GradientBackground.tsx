import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

interface GradientBackgroundProps extends ViewProps {
    children: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, style, ...props }) => {
    return (
        <View style={[styles.container, style]} {...props}>
            <LinearGradient
                colors={Colors.gradient as any}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
            />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
