import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { ChevronRight, Lock } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AnalysisComplete'>;

export const AnalysisCompleteScreen: React.FC<Props> = ({ route, navigation }) => {
    const { lifePath } = route.params;

    return (
        <GradientBackground style={styles.container}>
            <SafeAreaView style={styles.safe}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <MysticalText variant="caption" style={styles.headerLabel}>ANALYSIS COMPLETE</MysticalText>
                        <MysticalText variant="subtitle" style={styles.subLabel}>YOUR LIFE PATH NUMBER</MysticalText>
                    </View>

                    <View style={styles.heroCircle}>
                        <View style={styles.glow} />
                        <MysticalText style={styles.lifePathValue}>{lifePath}</MysticalText>
                        <MysticalText variant="h2" style={styles.lifePathTitle}>The Powerhouse</MysticalText>
                        <View style={styles.tag}>
                            <MysticalText variant="caption" style={styles.tagText}>ABUNDANCE & ACHIEVEMENT</MysticalText>
                        </View>
                        <MysticalText variant="body" style={styles.heroDescription}>
                            You are destined for material success and authority. Your path involves manifesting abundance and wielding power wisely.
                        </MysticalText>
                    </View>

                    <View style={styles.lockedSection}>
                        <MysticalText variant="subtitle" style={styles.lockedTitle}>DEEP INSIGHTS LOCKED</MysticalText>

                        <LockedItem
                            title="Destiny Number Analysis"
                            subtitle="Your soul's purpose revealed"
                        />
                        <LockedItem
                            title="Personal Year 2026"
                            subtitle="What this year holds for you"
                        />
                        <LockedItem
                            title="Love Compatibility"
                            subtitle="Your ideal partner numbers"
                        />
                    </View>

                    <View style={styles.footer}>
                        <Button
                            title="Unlock Your Full Report"
                            onPress={() => navigation.navigate('MainTabs', route.params)}
                        />
                        <MysticalText variant="caption" style={styles.footerNote}>
                            25+ pages of personalized insights
                        </MysticalText>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
};

const LockedItem = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <TouchableOpacity activeOpacity={0.7}>
        <GlassCard style={styles.lockedItem}>
            <View style={styles.lockIconBox}>
                <Lock color={Colors.textSecondary} size={20} />
            </View>
            <View style={styles.lockedItemContent}>
                <MysticalText variant="body" style={styles.itemName}>{title}</MysticalText>
                <MysticalText variant="caption" style={styles.itemSub}>{subtitle}</MysticalText>
            </View>
            <ChevronRight color={Colors.textSecondary} size={20} />
        </GlassCard>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safe: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        paddingTop: 30,
        marginBottom: 20,
    },
    headerLabel: {
        color: Colors.primary,
        letterSpacing: 2,
        fontWeight: '700',
        marginBottom: 20,
    },
    subLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        letterSpacing: 2,
    },
    heroCircle: {
        alignItems: 'center',
        paddingHorizontal: 40,
        marginBottom: 30,
    },
    glow: {
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: Colors.secondary,
        opacity: 0.2,
        top: -20,
    },
    lifePathValue: {
        fontSize: 80,
        fontWeight: '700',
        color: Colors.primary,
        lineHeight: 90,
    },
    lifePathTitle: {
        marginBottom: 10,
    },
    tag: {
        backgroundColor: 'rgba(155, 89, 182, 0.2)',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
        marginBottom: 20,
    },
    tagText: {
        color: Colors.secondary,
        fontWeight: '700',
    },
    heroDescription: {
        textAlign: 'center',
        lineHeight: 22,
        opacity: 0.8,
    },
    lockedSection: {
        paddingHorizontal: 25,
    },
    lockedTitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '700',
        marginBottom: 15,
        letterSpacing: 1,
    },
    lockedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 12,
    },
    lockIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    lockedItemContent: {
        flex: 1,
    },
    itemName: {
        fontWeight: '600',
    },
    itemSub: {
        marginTop: 2,
    },
    footer: {
        paddingHorizontal: 25,
        marginTop: 20,
    },
    footerNote: {
        textAlign: 'center',
        marginTop: 10,
        opacity: 0.6,
    }
});
