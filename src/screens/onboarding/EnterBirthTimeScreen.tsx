import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Clock } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { OnboardingHeader } from '../../components/shared/OnboardingHeader';
import { useSettings } from '../../context/SettingsContext';
import { localeForLanguage } from '../../utils/translations';

interface EnterBirthTimeScreenProps {
    onContinue: (timeString: string) => void;
    onBack: () => void;
}

function formatTimeToHHmm(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export const EnterBirthTimeScreen: React.FC<EnterBirthTimeScreenProps> = ({ onContinue, onBack }) => {
    const { t, language } = useSettings();
    const [time, setTime] = useState(new Date(2000, 0, 1, 12, 0, 0));

    const onChange = (_event: any, selectedDate?: Date) => {
        if (selectedDate) setTime(selectedDate);
    };

    const locale = localeForLanguage[language as keyof typeof localeForLanguage] || 'en-US';
    const timeLabel = time.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });

    return (
        <GradientBackground style={styles.container}>
            <OnboardingHeader step={4} totalSteps={10} onBack={onBack} />

            <View style={styles.header}>
                <MysticalText variant="h1" style={styles.title}>
                    {t('enterBirthTimeTitle')}
                </MysticalText>
                <MysticalText variant="subtitle" style={styles.subtitle}>
                    {t('enterBirthTimeSubtitle')}
                </MysticalText>
            </View>

            <View style={styles.pickerContainer}>
                <GlassCard style={styles.timeDisplay}>
                    <Clock color={Colors.primary} size={32} style={styles.clockIcon} />
                    <MysticalText variant="h2" style={styles.timeText}>
                        {timeLabel}
                    </MysticalText>
                </GlassCard>

                <View style={styles.actualPicker}>
                    <DateTimePicker
                        value={time}
                        mode="time"
                        display="spinner"
                        onChange={onChange}
                        textColor="#ffffff"
                        themeVariant="dark"
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    title={t('continue')}
                    onPress={() => onContinue(formatTimeToHHmm(time))}
                />
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 25,
        paddingTop: 60,
        paddingBottom: 50,
    },
    header: {
        marginBottom: 30,
    },
    title: {
        marginBottom: 10,
        fontSize: 28,
    },
    subtitle: {
        fontSize: 14,
        opacity: 0.8,
    },
    pickerContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    timeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        marginBottom: 20,
    },
    clockIcon: {
        marginRight: 15,
    },
    timeText: {
        fontSize: 22,
    },
    actualPicker: {
        height: 180,
        justifyContent: 'center',
    },
    footer: {
        marginTop: 20,
    },
});
