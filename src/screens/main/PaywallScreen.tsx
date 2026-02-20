import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { Colors } from '../../constants/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRevenueCat } from '../../context/RevenueCatContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

/**
 * PaywallScreen: a thin bridge that immediately presents the RevenueCat native paywall UI
 * and navigates back once done. All purchase state is managed by RevenueCatContext.
 */
export const PaywallScreen: React.FC<Props> = ({ navigation }) => {
    const { presentPaywall, isPro } = useRevenueCat();

    useEffect(() => {
        const show = async () => {
            await presentPaywall();
            // After the paywall is dismissed (purchased, restored, or cancelled),
            // go back. If user purchased, screens will re-render via context immediately.
            navigation.goBack();
        };
        show();
    }, []);

    // Show a brief loading spinner while the native sheet is loading
    return (
        <GradientBackground>
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
