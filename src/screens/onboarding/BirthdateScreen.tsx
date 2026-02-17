import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { ChevronLeft, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface BirthdateScreenProps {
    onContinue: (date: Date) => void;
    onBack: () => void;
}

import { OnboardingHeader } from '../../components/shared/OnboardingHeader';

export const BirthdateScreen: React.FC<BirthdateScreenProps> = ({ onContinue, onBack }) => {
    const [date, setDate] = useState(new Date(1990, 0, 1));
    const [show, setShow] = useState(true);

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    return (
        <GradientBackground style={styles.container}>
            <OnboardingHeader step={9} totalSteps={10} onBack={onBack} />

            <View style={styles.header}>
                <MysticalText variant="h1" style={styles.title}>
                    When were you {'\n'}
                    <MysticalText variant="h1" color={Colors.primary}>born?</MysticalText>
                </MysticalText>
                <MysticalText variant="subtitle" style={styles.subtitle}>
                    Your date of birth reveals your Life Path and inner character.
                </MysticalText>
            </View>

            <View style={styles.pickerContainer}>
                <GlassCard style={styles.dateDisplay}>
                    <Calendar color={Colors.primary} size={32} style={styles.calendarIcon} />
                    <MysticalText variant="h2" style={styles.dateText}>
                        {date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </MysticalText>
                </GlassCard>

                <View style={styles.actualPicker}>
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="spinner"
                        onChange={onChange}
                        textColor="#ffffff"
                        themeVariant="dark"
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Button title="Continue" onPress={() => onContinue(date)} />
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
    backButton: {
        marginBottom: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    stepText: {
        color: Colors.primary,
        fontWeight: '700',
    },
    percentText: {
        color: Colors.textSecondary,
    },
    progressBarBg: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        marginBottom: 40,
    },
    progressBarFilled: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
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
    },
    pickerContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    dateDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        marginBottom: 20,
    },
    calendarIcon: {
        marginRight: 15,
    },
    dateText: {
        fontSize: 22,
    },
    actualPicker: {
        height: 200,
        justifyContent: 'center',
    },
    footer: {
        marginTop: 20,
    },
});
