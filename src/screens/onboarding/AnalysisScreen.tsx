import React, { useEffect, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    ScrollView,
    Platform,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

import { MysticalText } from '../../components/ui/MysticalText';
import { Colors } from '../../constants/Colors';
import { RootStackParamList } from '../../navigation/types';
import { useOnboardingStore } from '../../../store/onboardingStore';
import { buildAnalysisCopy } from '../../utils/buildAnalysisCopy';
import { useSettings } from '../../context/SettingsContext';
import { AnalysisMagicalBackground } from '../../components/analysis/AnalysisMagicalBackground';
import { LifePathEmblem } from '../../components/analysis/LifePathEmblem';
import type { LifePathKey } from '../../../constants/onboardingData';
import { persistOnboardingResumeForPaywall } from '../../utils/onboardingResumeStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'Analysis'>;

function strengthAccentParts(sentence: string): { lead: string; rest: string } {
    const t = sentence.trim();
    const comma = t.indexOf(',');
    if (comma > 0 && comma < t.length - 2) {
        return {
            lead: t.slice(0, comma + 1),
            rest: ' ' + t.slice(comma + 1).trim(),
        };
    }
    const space = t.indexOf(' ');
    if (space > 0) {
        return { lead: t.slice(0, space), rest: t.slice(space) };
    }
    return { lead: t, rest: '' };
}

export const AnalysisScreen: React.FC<Props> = ({ navigation }) => {
    const { height } = useWindowDimensions();
    const { t, textDirection, language } = useSettings();
    const name = useOnboardingStore((s) => s.name);
    const lifePathNumber = useOnboardingStore((s) => s.lifePathNumber);
    const branchId = useOnboardingStore((s) => s.branchId);
    const frictionId = useOnboardingStore((s) => s.frictionId);
    const identityId = useOnboardingStore((s) => s.identityId);

    useEffect(() => {
        void persistOnboardingResumeForPaywall();
    }, []);

    const {
        displayName,
        lpLabel,
        lpResolved,
        giftArchetype,
        strengthSentence,
        blockParagraph,
    } = useMemo(
        () =>
            buildAnalysisCopy(
                {
                    name,
                    lifePathNumber,
                    branchId,
                    frictionId,
                    identityId,
                },
                language,
            ),
        [name, lifePathNumber, branchId, frictionId, identityId, language],
    );

    const { lead: strengthLead, rest: strengthRest } = strengthAccentParts(strengthSentence);
    const compact = height < 720;

    return (
        <View style={styles.root}>
            <AnalysisMagicalBackground />
            <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={[styles.scrollContent, compact && styles.scrollContentCompact]}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <Animated.View entering={FadeIn.duration(520)}>
                        <Text
                            style={[
                                styles.echoHeader,
                                { textAlign: textDirection === 'right' ? 'right' : 'left' },
                            ]}
                            maxFontSizeMultiplier={1.2}
                        >
                            {t('analysisYourEcho')}
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.duration(640).delay(80)}>
                        <LifePathEmblem
                            lifePath={lpResolved as LifePathKey}
                            lifePathCaption={t('analysisLifePathLabel')}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.duration(700).delay(140)} style={styles.bodyBlock}>
                        <Text
                            style={[
                                styles.greeting,
                                { textAlign: textDirection === 'right' ? 'right' : 'left' },
                            ]}
                            maxFontSizeMultiplier={1.15}
                        >
                            {t('analysisGreetingHi')} {displayName},
                        </Text>

                        <MysticalText
                            variant="caption"
                            style={[
                                styles.sectionKicker,
                                { textAlign: textDirection === 'right' ? 'right' : 'left' },
                            ]}
                        >
                            {t('analysisInnerLight')}
                        </MysticalText>

                        <Text
                            style={[
                                styles.lightIntro,
                                { textAlign: textDirection === 'right' ? 'right' : 'left' },
                            ]}
                            maxFontSizeMultiplier={1.12}
                        >
                            <Text style={styles.lightIntroBase}>{t('analysisLightPart1')}</Text>
                            <Text style={styles.lightGold}>
                                {t('analysisLifePathLabel')} {lpLabel}
                            </Text>
                            <Text style={styles.lightIntroBase}>{t('analysisLightPart2')}</Text>
                            <Text style={styles.lightGold}>{giftArchetype}</Text>
                            <Text style={styles.lightIntroBase}>{t('analysisLightPart3')}</Text>
                        </Text>

                        <Text
                            style={[
                                styles.lightStrength,
                                { textAlign: textDirection === 'right' ? 'right' : 'left' },
                            ]}
                            maxFontSizeMultiplier={1.12}
                        >
                            <Text style={styles.lightStrengthAccent}>{strengthLead}</Text>
                            <Text style={styles.lightStrengthBody}>{strengthRest}</Text>
                        </Text>

                        <View style={styles.divider} />

                        <MysticalText
                            variant="caption"
                            style={[
                                styles.sectionKicker,
                                styles.sectionKickerMuted,
                                { textAlign: textDirection === 'right' ? 'right' : 'left' },
                            ]}
                        >
                            {t('analysisBlockTitle')}
                        </MysticalText>

                        <Text
                            style={[
                                styles.blockBody,
                                { textAlign: textDirection === 'right' ? 'right' : 'left' },
                            ]}
                            maxFontSizeMultiplier={1.12}
                        >
                            {blockParagraph}
                        </Text>

                        <Text
                            style={[
                                styles.bridge,
                                { textAlign: textDirection === 'right' ? 'right' : 'left' },
                            ]}
                            maxFontSizeMultiplier={1.1}
                        >
                            {t('analysisBridgeLine')}
                        </Text>
                    </Animated.View>
                </ScrollView>

                <View style={styles.ctaWrap}>
                    <Pressable
                        style={({ pressed }) => [styles.ctaOuter, pressed && { opacity: 0.94, transform: [{ scale: 0.99 }] }]}
                        onPress={() => navigation.navigate('Paywall', { variant: 'onboarding' })}
                        accessibilityRole="button"
                        accessibilityLabel={t('continue')}
                    >
                        <LinearGradient
                            colors={Colors.goldGradient as [string, string, string]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.ctaGradient}
                        >
                            <Text style={styles.ctaLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
                                {t('continue')}
                            </Text>
                        </LinearGradient>
                    </Pressable>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#080614',
    },
    safe: { flex: 1 },
    scroll: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 26,
        paddingTop: 4,
        paddingBottom: 120,
    },
    scrollContentCompact: {
        paddingBottom: 100,
    },
    echoHeader: {
        fontSize: 11,
        fontWeight: '500',
        letterSpacing: 5,
        color: 'rgba(232, 224, 255, 0.72)',
        paddingTop: 10,
        paddingBottom: 6,
        paddingHorizontal: 2,
        textTransform: 'uppercase',
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif-medium' },
        }),
    },
    bodyBlock: {
        marginTop: 4,
    },
    greeting: {
        fontSize: 24,
        fontWeight: '600',
        color: '#faf8ff',
        marginBottom: 22,
        letterSpacing: 0.2,
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif' },
        }),
    },
    sectionKicker: {
        fontSize: 12,
        letterSpacing: 1.8,
        textTransform: 'uppercase',
        color: 'rgba(180, 186, 204, 0.95)',
        marginBottom: 10,
        fontWeight: '600',
    },
    sectionKickerMuted: {
        color: 'rgba(195, 204, 222, 0.95)',
        marginTop: 4,
    },
    lightIntro: {
        fontSize: 17,
        lineHeight: 26,
        marginBottom: 16,
    },
    lightIntroBase: {
        color: 'rgba(245, 240, 255, 0.92)',
        fontWeight: '400',
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif' },
        }),
    },
    lightGold: {
        color: '#f4e4a8',
        fontWeight: '700',
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif' },
        }),
    },
    lightStrength: {
        fontSize: 17,
        lineHeight: 27,
        marginBottom: 6,
    },
    lightStrengthAccent: {
        color: '#f0dfa6',
        fontWeight: '600',
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif' },
        }),
    },
    lightStrengthBody: {
        color: 'rgba(248, 244, 232, 0.94)',
        fontWeight: '400',
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif' },
        }),
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginVertical: 26,
    },
    blockBody: {
        fontSize: 16,
        lineHeight: 26,
        color: 'rgba(220, 226, 238, 0.94)',
        fontWeight: '400',
        marginBottom: 22,
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif' },
        }),
    },
    bridge: {
        fontSize: 16,
        lineHeight: 24,
        color: 'rgba(200, 206, 220, 0.88)',
        fontWeight: '500',
        marginBottom: 8,
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif' },
        }),
    },
    ctaWrap: {
        paddingHorizontal: 26,
        paddingBottom: 14,
        paddingTop: 8,
        backgroundColor: 'transparent',
    },
    ctaOuter: {
        borderRadius: 28,
        overflow: 'hidden',
        minHeight: 60,
        ...Platform.select({
            ios: {
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.4,
                shadowRadius: 18,
            },
            android: { elevation: 12 },
        }),
    },
    ctaGradient: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 60,
    },
    ctaLabel: {
        color: '#1a1408',
        fontWeight: '800',
        fontSize: 19,
        letterSpacing: 0.4,
        textAlign: 'center',
        width: '100%',
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif-medium' },
        }),
    },
});
