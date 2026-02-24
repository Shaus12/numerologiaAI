import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Colors } from '../../constants/Colors';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../../context/SettingsContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacyPolicy'>;

export const PrivacyPolicyScreen: React.FC<Props> = ({ navigation }) => {
    const { t } = useSettings();

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
                    <MysticalText variant="h2" style={styles.headerTitle}>{t('privacyPolicy')}</MysticalText>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <MysticalText variant="body" style={styles.paragraph}>{t('privacyPolicyIntro')}</MysticalText>
                    <MysticalText variant="subtitle" style={styles.sectionTitle}>{t('privacyPolicyDataTitle')}</MysticalText>
                    <MysticalText variant="body" style={styles.paragraph}>{t('privacyPolicyDataBody')}</MysticalText>
                    <MysticalText variant="subtitle" style={styles.sectionTitle}>{t('privacyPolicyUseTitle')}</MysticalText>
                    <MysticalText variant="body" style={styles.paragraph}>{t('privacyPolicyUseBody')}</MysticalText>
                    <MysticalText variant="subtitle" style={styles.sectionTitle}>{t('privacyPolicyContactTitle')}</MysticalText>
                    <MysticalText variant="body" style={[styles.paragraph, styles.lastParagraph]}>{t('privacyPolicyContactBody')}</MysticalText>
                </ScrollView>
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        marginBottom: 24,
    },
    backBtn: {
        padding: 20,
        minWidth: 64,
        minHeight: 64,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    headerTitle: { flex: 1, textAlign: 'center' },
    headerSpacer: { width: 64 },
    content: { paddingHorizontal: 24, paddingBottom: 48 },
    sectionTitle: {
        marginTop: 24,
        marginBottom: 10,
        color: Colors.primary,
    },
    paragraph: {
        lineHeight: 24,
        opacity: 0.92,
        marginBottom: 8,
    },
    lastParagraph: { marginBottom: 32 },
});
