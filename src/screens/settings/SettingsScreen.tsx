import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../../context/SettingsContext';

export const SettingsScreen = () => {
    const navigation = useNavigation();
    const { language, setLanguage, t } = useSettings();

    const LANGUAGES = ['English', 'Spanish', 'Portuguese', 'French', 'German', 'Hebrew'];

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backBtn}
                        activeOpacity={0.7}
                        hitSlop={{ top: 32, bottom: 32, left: 32, right: 32 }}
                    >
                        <ArrowLeft color="#fff" size={26} />
                    </TouchableOpacity>
                    <MysticalText variant="h2" style={styles.headerTitle}>{t('languageTitle')}</MysticalText>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    delaysContentTouches={false}
                >
                    <MysticalText variant="subtitle" style={styles.sectionTitle}>{t('languageTitle')}</MysticalText>

                    <GlassCard style={styles.card}>
                        {LANGUAGES.map((lang, index) => (
                            <TouchableOpacity
                                key={lang}
                                style={[
                                    styles.item,
                                    index !== LANGUAGES.length - 1 && styles.borderBottom
                                ]}
                                onPress={() => setLanguage(lang as any)}
                            >
                                <MysticalText style={styles.itemText}>{lang}</MysticalText>
                                {language === lang && <Check color={Colors.primary} size={20} />}
                            </TouchableOpacity>
                        ))}
                    </GlassCard>
                </ScrollView>
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        marginBottom: 30,
    },
    backBtn: {
        padding: 20,
        minWidth: 64,
        minHeight: 64,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 64,
    },
    content: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        marginBottom: 15,
        color: 'rgba(255,255,255,0.7)',
    },
    card: {
        padding: 0,
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    itemText: {
        fontSize: 16,
    }
});
