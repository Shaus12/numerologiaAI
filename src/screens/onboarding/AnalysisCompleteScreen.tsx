import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, BackHandler, Share as RNShare, InteractionManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Sparkles, Share2, CheckCircle2, Unlock } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRevenueCat } from '../../context/RevenueCatContext';
import { useSettings } from '../../context/SettingsContext';

/** ~5 lines at lineHeight 24 (2 more before fade) */
const TEASER_HEIGHT = 128;

type Props = NativeStackScreenProps<RootStackParamList, 'AnalysisComplete'>;

export const AnalysisCompleteScreen: React.FC<Props> = ({ route, navigation }) => {
    const { t } = useSettings();
    const { isPro, presentPaywall } = useRevenueCat();
    const results = route.params || {};

    const fullReading = results.reading || 'Your celestial path is being revealed...';

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
        InteractionManager.runAfterInteractions(() => {
            navigation.replace('MainTabs', results);
        });
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    delaysContentTouches={false}
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

                        {isPro ? (
                            fullReading.split('\n\n').map((paragraph, index) => (
                                <MysticalText key={index} variant="body" style={styles.readingText}>
                                    {paragraph.trim()}
                                </MysticalText>
                            ))
                        ) : (
                            <View style={styles.teaserWrapper}>
                                <View style={styles.teaserTextClip}>
                                    {fullReading.split('\n\n').map((paragraph, index) => (
                                        <MysticalText key={index} variant="body" style={styles.readingText}>
                                            {paragraph.trim()}
                                        </MysticalText>
                                    ))}
                                </View>
                                <LinearGradient
                                    colors={['rgba(10,6,18,0)', 'rgba(10,6,18,0.5)', Colors.background, Colors.background]}
                                    locations={[0, 0.3, 0.7, 1]}
                                    style={styles.teaserGradient}
                                    pointerEvents="none"
                                />
                                <View style={styles.teaserFadeContent} pointerEvents="none">
                                    <View style={styles.lockBadge}>
                                        <Ionicons name="lock-closed" size={28} color={Colors.primary} style={styles.teaserLockIcon} />
                                        <MysticalText variant="body" style={styles.teaserFadeLabel}>
                                            {t('teaserFadeLabel')}
                                        </MysticalText>
                                    </View>
                                </View>
                            </View>
                        )}
                    </GlassCard>

                    <View style={styles.actions}>
                        {!isPro && (
                            <View style={styles.unlockCtaWrap}>
                                <TouchableOpacity
                                    style={styles.premiumCtaButton}
                                    onPress={presentPaywall}
                                    activeOpacity={0.85}
                                >
                                    <LinearGradient
                                        colors={['#b794f6', '#9b59b6', '#7d3c98']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.premiumCtaGradient}
                                    >
                                        <View style={styles.premiumCtaContent}>
                                            <Unlock color="#fff" size={24} style={styles.unlockIcon} />
                                            <MysticalText style={styles.premiumCtaText}>{t('unlockFreeTrial3Days')}</MysticalText>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <MysticalText variant="caption" style={styles.trialSubtext}>
                                    {t('trialSubtext')}
                                </MysticalText>
                            </View>
                        )}
                        <Button
                            title={t('viewDashboard')}
                            onPress={handleContinue}
                            variant="primary"
                        />
                        {isPro && (
                            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                                <Share2 color={Colors.primary} size={20} />
                                <MysticalText style={styles.shareText}>{t('shareResult')}</MysticalText>
                            </TouchableOpacity>
                        )}
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
        marginBottom: 16,
    },
    teaserWrapper: {
        position: 'relative',
        width: '100%',
    },
    teaserTextClip: {
        maxHeight: TEASER_HEIGHT,
        overflow: 'hidden',
    },
    teaserGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: TEASER_HEIGHT * 0.85,
    },
    teaserFadeContent: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    lockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(10, 6, 18, 0.92)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.4)',
    },
    teaserLockIcon: {
        marginBottom: 0,
    },
    teaserFadeLabel: {
        textAlign: 'center',
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 15,
    },
    unlockCtaWrap: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 8,
    },
    premiumCtaButton: {
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#9b59b6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 16,
        elevation: 10,
    },
    premiumCtaGradient: {
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 20,
    },
    premiumCtaContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    unlockIcon: {
        marginTop: -2,
    },
    premiumCtaText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    trialSubtext: {
        marginTop: 8,
        opacity: 0.7,
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
});
