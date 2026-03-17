import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Home, Phone, Type, Calendar } from 'lucide-react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';
import { useSettings } from '../../context/SettingsContext';
import { usePostHog } from 'posthog-react-native';

type Props = BottomTabScreenProps<MainTabParamList, 'Map'>;

// ——— Numerology helpers (for future use by toolkit features) ———
/**
 * Reduces a number to a single digit 1–9 by repeatedly summing its digits.
 * e.g. 37 → 3+7=10 → 1+0=1
 */
export function reduceToSingleDigit(num: number): number {
    if (!Number.isFinite(num) || num < 0) return 0;
    let n = Math.floor(num);
    while (n > 9) {
        let sum = 0;
        while (n > 0) {
            sum += n % 10;
            n = Math.floor(n / 10);
        }
        n = sum;
    }
    return n === 0 ? 9 : n; // treat 0 as 9 in numerology, or keep 0; common to return 9 for 0
}

/**
 * Pythagorean numerology: A=1, B=2, … I=9, J=1, … Z=8.
 * Sums letter values and reduces to a single digit 1–9.
 */
export function calculateStringValue(text: string): number {
    if (!text || typeof text !== 'string') return 0;
    const upper = text.toUpperCase().replace(/\s/g, '');
    let sum = 0;
    for (let i = 0; i < upper.length; i++) {
        const code = upper.charCodeAt(i);
        if (code >= 65 && code <= 90) {
            // A=1…I=9, J=1…R=9, S=1…Z=8
            const n = (code - 65) % 9;
            sum += n + 1; // 0→1, 1→2, …, 8→9
        }
    }
    return reduceToSingleDigit(sum);
}

// ——— Toolkit feature card ———
const ToolkitCard = ({
    icon: Icon,
    titleKey,
    descKey,
    onPress,
}: {
    icon: React.ComponentType<{ color: string; size: number }>;
    titleKey: string;
    descKey: string;
    onPress?: () => void;
}) => {
    const { t } = useSettings();
    const content = (
        <GlassCard style={styles.card} border>
            <View style={styles.cardIconWrap}>
                <Icon color={Colors.primary} size={22} />
            </View>
            <MysticalText variant="subtitle" style={styles.cardTitle} numberOfLines={2}>
                {t(titleKey)}
            </MysticalText>
            <MysticalText variant="caption" style={styles.cardDesc} numberOfLines={2}>
                {t(descKey)}
            </MysticalText>
        </GlassCard>
    );
    if (onPress) {
        return <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.cardTouchable}>{content}</TouchableOpacity>;
    }
    return <View style={styles.cardTouchable}>{content}</View>;
};

export const MapScreen: React.FC<Props> = ({ navigation }) => {
    const { t } = useSettings();
    const posthog = usePostHog();
    const parentNav = navigation.getParent() as any;

    const openPhoneNumberEnergy = () => {
        if (posthog) {
            posthog.capture('toolkit_pro_tool_clicked', { tool: 'phone_number' });
        }
        parentNav?.navigate('PhoneNumberEnergy');
    };

    const openNameEnergy = () => {
        parentNav?.navigate('NameEnergy');
    };

    const openDateEnergy = () => {
        if (posthog) {
            posthog.capture('toolkit_pro_tool_clicked', { tool: 'important_dates' });
        }
        parentNav?.navigate('DateEnergy');
    };

    const openHomeEnergy = () => {
        parentNav?.navigate('HomeEnergy');
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container} edges={['top']}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    style={styles.scroll}
                >
                    {/* LTR container so layout is always left-to-right */}
                    <View style={styles.ltrContainer}>
                        <MysticalText variant="h2" style={styles.title}>
                            {t('toolkitTitle')}
                        </MysticalText>
                        <MysticalText variant="body" style={styles.subtitle}>
                            {t('toolkitSubtitle')}
                        </MysticalText>
                        <MysticalText variant="caption" style={styles.explanation}>
                            {t('toolkitExplanation')}
                        </MysticalText>

                        <View style={styles.grid}>
                            <ToolkitCard
                                icon={Home}
                                titleKey="toolkitCardHomeTitle"
                                descKey="toolkitCardHomeDesc"
                                onPress={openHomeEnergy}
                            />
                            <ToolkitCard
                                icon={Phone}
                                titleKey="toolkitCardPhoneTitle"
                                descKey="toolkitCardPhoneDesc"
                                onPress={openPhoneNumberEnergy}
                            />
                            <ToolkitCard
                                icon={Type}
                                titleKey="toolkitCardNamesTitle"
                                descKey="toolkitCardNamesDesc"
                                onPress={openNameEnergy}
                            />
                            <ToolkitCard
                                icon={Calendar}
                                titleKey="toolkitCardDatesTitle"
                                descKey="toolkitCardDatesDesc"
                                onPress={openDateEnergy}
                            />
                        </View>
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
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    ltrContainer: {
        direction: 'ltr',
        width: '100%',
    },
    title: {
        marginTop: 10,
        marginBottom: 8,
        color: Colors.text,
    },
    subtitle: {
        color: Colors.textSecondary,
        marginBottom: 8,
        opacity: 0.95,
    },
    explanation: {
        color: Colors.textSecondary,
        marginBottom: 20,
        opacity: 0.9,
        lineHeight: 18,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 14,
    },
    cardTouchable: {
        width: '48%',
        height: 152,
    },
    card: {
        padding: 14,
        height: '100%',
        minHeight: 152,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.25)',
        backgroundColor: 'rgba(26, 11, 46, 0.6)',
    },
    cardIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 11,
        color: Colors.textSecondary,
        lineHeight: 15,
        opacity: 0.9,
        marginBottom: 0,
    },
});
