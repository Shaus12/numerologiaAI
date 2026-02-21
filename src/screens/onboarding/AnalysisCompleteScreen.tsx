import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, BackHandler, Share as RNShare, Alert, InteractionManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Sparkles, Share2, CheckCircle2, ChevronRight, Lock } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRevenueCat } from '../../context/RevenueCatContext';
import { useSettings } from '../../context/SettingsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AnalysisComplete'>;

export const AnalysisCompleteScreen: React.FC<Props> = ({ route, navigation }) => {
    const { t } = useSettings();
    const { isPro, presentPaywall } = useRevenueCat();
    const results = route.params || {};

    // Prevent going back during this critical success state
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
    }, []);

    const handleShare = async () => {
        try {
            await RNShare.share({
                message: `I just discovered my Life Path is ${results.lifePath}! The Powerhouse.\n\nUnlock your own detailed numerology report with Numerologia AI.`,
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const handleContinue = () => {
        // Prioritize interaction/feedback over screen replacement logic
        InteractionManager.runAfterInteractions(() => {
            // Reset to main tabs
            navigation.replace('MainTabs', results);
        });
    };

    const reading = results.reading || 'Your celestial path is being revealed...';

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.successIcon}>
                        <CheckCircle2 color={Colors.primary} size={64} />
                    </View>

                    <MysticalText variant="h1" style={styles.title}>
                        {t('analysisComplete')}
                    </MysticalText>
                    <MysticalText variant="body" style={styles.subtitle}>
                        {t('blueprintReady')}
                    </MysticalText>

                    <GlassCard style={styles.resultCard}>
                        <View style={styles.nodeHeader}>
                            <Sparkles color={Colors.primary} size={20} />
                            <MysticalText variant="subtitle" style={styles.nodeTitle}>
                                {t('lifePath')} {results.lifePath}
                            </MysticalText>
                        </View>
                        <MysticalText variant="body" style={styles.readingText}>
                            {reading}
                        </MysticalText>
                    </GlassCard>

                    {!isPro && (
                        <TouchableOpacity style={styles.proUpgradeCard} onPress={presentPaywall}>
                            <GlassCard style={styles.proUpgradeInner}>
                                <View style={styles.proHeader}>
                                    <Sparkles color={Colors.primary} size={24} />
                                    <MysticalText variant="subtitle" style={styles.proTitle}>
                                        {t('unlockFullProExperience')}
                                    </MysticalText>
                                </View>
                                <MysticalText variant="caption" style={styles.proDescription}>
                                    Unlock daily transits, advanced compatibility, and personalized AI oracle insights.
                                </MysticalText>
                                <View style={styles.proButton}>
                                    <MysticalText style={styles.proButtonText}>Upgrade to Pro</MysticalText>
                                    <ChevronRight color="#000" size={18} />
                                </View>
                            </GlassCard>
                        </TouchableOpacity>
                    )}

                    <View style={styles.actions}>
                        <Button
                            title={t('viewDashboard')}
                            onPress={handleContinue}
                            variant="primary"
                        />

                        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                            <Share2 color={Colors.primary} size={20} />
                            <MysticalText style={styles.shareText}>{t('shareResult')}</MysticalText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        alignItems: 'center',
        paddingTop: 40,
    },
    successIcon: {
        marginBottom: 24,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        opacity: 0.7,
        marginBottom: 32,
    },
    resultCard: {
        width: '100%',
        padding: 24,
        marginBottom: 40,
        position: 'relative',
        overflow: 'hidden',
    },
    nodeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    nodeTitle: {
        color: Colors.primary,
        fontSize: 18,
        fontWeight: '700',
    },
    readingText: {
        lineHeight: 24,
        opacity: 0.9,
    },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(10, 6, 18, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockContent: {
        alignItems: 'center',
        padding: 20,
    },
    unlockTitle: {
        color: Colors.primary,
        marginTop: 12,
        marginBottom: 4,
    },
    unlockSub: {
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    actions: {
        width: '100%',
        gap: 16,
    },
    shareBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 12,
    },
    shareText: {
        color: Colors.primary,
        fontWeight: '600',
    },
    proUpgradeCard: {
        width: '100%',
        marginBottom: 32,
    },
    proUpgradeInner: {
        padding: 20,
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
        borderColor: Colors.primary,
        borderWidth: 1,
    },
    proHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    proTitle: {
        color: Colors.primary,
        fontWeight: '800',
        fontSize: 18,
    },
    proDescription: {
        opacity: 0.8,
        marginBottom: 16,
        lineHeight: 18,
    },
    proButton: {
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    proButtonText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 14,
    },
});
