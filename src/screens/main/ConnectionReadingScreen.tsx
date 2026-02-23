import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useVault } from '../../context/VaultContext';
import { useUser } from '../../context/UserContext';
import { useSettings } from '../../context/SettingsContext';
import { AIService } from '../../services/ai';
import { ArrowLeft } from 'lucide-react-native';
import type { ConnectionCompatibility } from '../../types/vault';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'ConnectionReading'>;

function parseConnectionReading(raw: string): ConnectionCompatibility | null {
    try {
        let text = raw.trim();
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) text = jsonMatch[1].trim();
        const parsed = JSON.parse(text) as unknown;
        if (!parsed || typeof parsed !== 'object') return null;
        const o = parsed as Record<string, unknown>;
        const score = typeof o.score === 'number' ? Math.min(100, Math.max(1, o.score)) : 50;
        const title = typeof o.title === 'string' ? o.title : '';
        const strengths = Array.isArray(o.strengths)
            ? o.strengths.filter((s): s is string => typeof s === 'string')
            : [];
        const challenges = Array.isArray(o.challenges)
            ? o.challenges.filter((c): c is string => typeof c === 'string')
            : [];
        const summary = typeof o.summary === 'string' ? o.summary : '';
        return { score, title, strengths, challenges, summary };
    } catch {
        return null;
    }
}

function scoreColor(score: number): string {
    if (score >= 75) return '#4caf50'; // success green
    if (score >= 50) return Colors.primary; // gold
    return '#e0a030'; // amber for lower
}

export const ConnectionReadingScreen: React.FC<Props> = ({ route, navigation }) => {
    const { connectionId } = route.params;
    const { t, language } = useSettings();
    const { getConnectionById, updateConnection } = useVault();
    const { userProfile, numerologyResults } = useUser();

    const connection = getConnectionById(connectionId);
    const [rawReading, setRawReading] = useState<string | null>(connection?.cachedReading ?? null);
    const [loading, setLoading] = useState(!connection?.cachedReading);
    const [error, setError] = useState<string | null>(null);

    const parsed = useMemo(() => (rawReading ? parseConnectionReading(rawReading) : null), [rawReading]);
    const isLegacyFormat = rawReading != null && parsed == null;

    const userLifePath = numerologyResults?.lifePath ?? 0;
    const lang = userProfile?.language ?? language ?? 'English';

    useEffect(() => {
        if (!connection) return;
        if (connection.cachedReading) {
            setRawReading(connection.cachedReading);
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        (async () => {
            try {
                const result = await AIService.getConnectionCompatibility(
                    userLifePath,
                    connection.birthdate,
                    connection.relationshipType,
                    lang,
                    userProfile?.identity ? { identity: userProfile.identity } : undefined
                );
                if (!cancelled) {
                    setRawReading(result);
                    await updateConnection(connectionId, { cachedReading: result });
                }
            } catch (e) {
                if (!cancelled) {
                    setError('Something went wrong.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [connectionId, connection, userLifePath, lang, updateConnection]);

    if (!connection) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <ArrowLeft color="#fff" size={24} />
                    </TouchableOpacity>
                    <MysticalText variant="body">Connection not found.</MysticalText>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}>
                    <ArrowLeft color="#fff" size={24} />
                </TouchableOpacity>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <MysticalText variant="h2" style={styles.title}>{t('connectionReadingTitle')}</MysticalText>
                    <MysticalText variant="body" style={styles.subtitle}>
                        {connection.name} · {connection.relationshipType}
                    </MysticalText>

                    {loading && (
                        <View style={styles.loadingWrap}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                            <MysticalText variant="body" style={styles.loadingText}>{t('generatingReading')}</MysticalText>
                        </View>
                    )}

                    {error && (
                        <GlassCard style={styles.card}>
                            <MysticalText variant="body" style={styles.errorText}>{error}</MysticalText>
                            <Button title={t('continue')} variant="primary" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
                        </GlassCard>
                    )}

                    {!loading && !error && parsed && (
                        <>
                            <View style={styles.scoreSection}>
                                <View style={[styles.scoreRing, { borderColor: scoreColor(parsed.score) }]}>
                                    <MysticalText variant="h1" style={[styles.scoreNumber, { color: scoreColor(parsed.score) }]}>
                                        {parsed.score}
                                    </MysticalText>
                                </View>
                                <MysticalText variant="body" style={styles.scoreLabel}>{t('compatibilityScore')}</MysticalText>
                                <MysticalText variant="h2" style={styles.dashboardTitle}>{parsed.title}</MysticalText>
                            </View>

                            {parsed.strengths.length > 0 && (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Ionicons name="checkmark-circle" size={22} color="#4caf50" />
                                        <MysticalText variant="subtitle" style={styles.sectionTitle}>{t('strengthsLabel')}</MysticalText>
                                    </View>
                                    <GlassCard style={styles.listCard}>
                                        {parsed.strengths.map((item, i) => (
                                            <View key={i} style={styles.listItem}>
                                                <Ionicons name="star" size={18} color={Colors.primary} style={styles.listIcon} />
                                                <MysticalText variant="body" style={styles.listItemText}>{item}</MysticalText>
                                            </View>
                                        ))}
                                    </GlassCard>
                                </View>
                            )}

                            {parsed.challenges.length > 0 && (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Ionicons name="flash" size={22} color="#e0a030" />
                                        <MysticalText variant="subtitle" style={styles.sectionTitle}>{t('challengesLabel')}</MysticalText>
                                    </View>
                                    <GlassCard style={styles.listCard}>
                                        {parsed.challenges.map((item, i) => (
                                            <View key={i} style={styles.listItem}>
                                                <Ionicons name="warning" size={18} color="#e0a030" style={styles.listIcon} />
                                                <MysticalText variant="body" style={styles.listItemText}>{item}</MysticalText>
                                            </View>
                                        ))}
                                    </GlassCard>
                                </View>
                            )}

                            {parsed.summary ? (
                                <View style={styles.section}>
                                    <MysticalText variant="subtitle" style={[styles.sectionTitle, styles.bottomLineTitle]}>{t('bottomLineLabel')}</MysticalText>
                                    <GlassCard style={styles.summaryCard}>
                                        <MysticalText variant="body" style={styles.summaryText}>{parsed.summary}</MysticalText>
                                    </GlassCard>
                                </View>
                            ) : null}
                        </>
                    )}

                    {!loading && !error && isLegacyFormat && (
                        <GlassCard style={styles.card}>
                            {rawReading!.split('\n\n').map((paragraph, i) => (
                                <MysticalText key={i} variant="body" style={styles.paragraph}>
                                    {paragraph.trim()}
                                </MysticalText>
                            ))}
                        </GlassCard>
                    )}
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    backBtn: {
        position: 'absolute',
        top: 56,
        left: 20,
        zIndex: 10,
        padding: 12,
    },
    scrollContent: { padding: 24, paddingTop: 100, paddingBottom: 48 },
    title: { marginBottom: 8 },
    subtitle: { opacity: 0.8, marginBottom: 28 },
    loadingWrap: { paddingVertical: 48, alignItems: 'center', gap: 16 },
    loadingText: { opacity: 0.8 },
    card: { padding: 24 },
    paragraph: { marginBottom: 16, lineHeight: 24, opacity: 0.95 },
    errorText: { color: Colors.error },

    scoreSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    scoreRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    scoreNumber: {
        fontSize: 44,
        fontWeight: '800',
    },
    scoreLabel: {
        opacity: 0.7,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    dashboardTitle: {
        textAlign: 'center',
        color: Colors.primary,
        paddingHorizontal: 16,
    },

    section: { marginBottom: 24 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        color: Colors.text,
        fontWeight: '700',
    },
    bottomLineTitle: { marginBottom: 12 },
    listCard: {
        padding: 16,
        paddingVertical: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 12,
    },
    listIcon: { marginTop: 2 },
    listItemText: { flex: 1, lineHeight: 22, opacity: 0.95 },
    summaryCard: {
        padding: 20,
        borderColor: 'rgba(212, 175, 55, 0.25)',
        borderWidth: 1,
    },
    summaryText: {
        lineHeight: 24,
        opacity: 0.95,
    },
});
