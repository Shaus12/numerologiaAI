import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Pressable,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    Activity,
    Briefcase,
    Calendar,
    Globe,
    Heart,
    Sparkles,
    Sprout,
    User,
    UserPlus,
    Users,
    EyeOff,
} from 'lucide-react-native';
import { usePostHog } from 'posthog-react-native';

import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { OnboardingHeader } from '../../components/shared/OnboardingHeader';
import { Colors } from '../../constants/Colors';
import { useSettings } from '../../context/SettingsContext';
import type { Language } from '../../utils/translations';
import { localeForLanguage } from '../../utils/translations';
import type { RootStackParamList } from '../../navigation/types';
import { ONBOARDING_BRANCHES, type OnboardingBranchKey } from '../../../constants/onboardingData';
import {
    useOnboardingStore,
    type FocusId,
    type RelationshipStatus,
} from '../../../store/onboardingStore';
import { clearOnboardingResume } from '../../utils/onboardingResumeStorage';

export type FlowStep =
    | 'language'
    | 'name'
    | 'gender'
    | 'birth'
    | 'focus'
    | 'relationship'
    | 'friction'
    | 'identity'
    | 'consent';

const LANGUAGES: { id: Language; name: string; flag: string }[] = [
    { id: 'English', name: 'English', flag: '🇺🇸' },
    { id: 'Spanish', name: 'Español', flag: '🇪🇸' },
    { id: 'Portuguese', name: 'Português', flag: '🇧🇷' },
    { id: 'French', name: 'Français', flag: '🇫🇷' },
    { id: 'German', name: 'Deutsch', flag: '🇩🇪' },
    { id: 'Russian', name: 'Русский', flag: '🇷🇺' },
    { id: 'Arabic', name: 'العربية', flag: '🇸🇦' },
    { id: 'Hebrew', name: 'עברית', flag: '🇮🇱' },
    { id: 'Bulgarian', name: 'Български', flag: '🇧🇬' },
];

const GENDER_OPTIONS = [
    { id: 'male', labelKey: 'male' as const, icon: User },
    { id: 'female', labelKey: 'female' as const, icon: UserPlus },
    { id: 'non-binary', labelKey: 'nonBinary' as const, icon: Users },
    { id: 'private', labelKey: 'preferNotToSay' as const, icon: EyeOff },
];

const FOCUS_OPTIONS: {
    id: FocusId;
    labelKey: 'focusLove' | 'focusCareer' | 'focusPersonalGrowth' | 'focusHealth';
    subKey: 'focusLoveSub' | 'focusCareerSub' | 'focusPersonalGrowthSub' | 'focusHealthSub';
    icon: typeof Heart;
}[] = [
    { id: 'love', labelKey: 'focusLove', subKey: 'focusLoveSub', icon: Heart },
    { id: 'career', labelKey: 'focusCareer', subKey: 'focusCareerSub', icon: Briefcase },
    { id: 'growth', labelKey: 'focusPersonalGrowth', subKey: 'focusPersonalGrowthSub', icon: Sprout },
    { id: 'wellness', labelKey: 'focusHealth', subKey: 'focusHealthSub', icon: Activity },
];

const RELATIONSHIP_OPTIONS: { id: Exclude<RelationshipStatus, null>; labelKey: 'statusSingle' | 'statusRelationship' }[] = [
    { id: 'single', labelKey: 'statusSingle' },
    { id: 'in_relationship', labelKey: 'statusRelationship' },
];

export interface OnboardingFlowScreenProps {
    navigation: NativeStackNavigationProp<RootStackParamList, 'OnboardingFlow'>;
}

function formatBirthDate(d: Date): string {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export const OnboardingFlowScreen: React.FC<OnboardingFlowScreenProps> = ({
    navigation,
}) => {
    const { t, language, setLanguage } = useSettings();
    const posthog = usePostHog();
    const resetOnboarding = useOnboardingStore((s) => s.resetOnboarding);
    const setBasicInfo = useOnboardingStore((s) => s.setBasicInfo);
    const setFocus = useOnboardingStore((s) => s.setFocus);
    const setPsychology = useOnboardingStore((s) => s.setPsychology);
    const branchIdFromStore = useOnboardingStore((s) => s.branchId);

    const [step, setStep] = useState<FlowStep>('language');
    const [draftName, setDraftName] = useState('');
    const [draftGender, setDraftGender] = useState('');
    const [birthDate, setBirthDate] = useState(new Date(1990, 0, 1));
    const [pendingFrictionId, setPendingFrictionId] = useState<string | null>(null);
    const [loveFlow, setLoveFlow] = useState(false);
    const [selectedLanguageId, setSelectedLanguageId] = useState<Language>(language);

    useEffect(() => {
        void clearOnboardingResume();
        resetOnboarding();
    }, [resetOnboarding]);

    const totalSteps = loveFlow ? 9 : 8;
    const headerStep = useMemo(() => {
        const order: FlowStep[] = [
            'language',
            'name',
            'gender',
            'birth',
            'focus',
            ...(loveFlow ? (['relationship'] as const) : []),
            'friction',
            'identity',
            'consent',
        ];
        const i = order.indexOf(step);
        return i >= 0 ? i + 1 : 0;
    }, [step, loveFlow]);

    const branchKey = branchIdFromStore as OnboardingBranchKey | '';
    const branchContent =
        branchKey && ONBOARDING_BRANCHES[branchKey]
            ? ONBOARDING_BRANCHES[branchKey]
            : null;

    const goConsent = useCallback(() => {
        setStep('consent');
    }, []);

    const handleLetsGo = () => {
        capture('consent');
        navigation.replace('LoadingAnalysis');
    };

    const capture = (name: string) => {
        try {
            posthog?.capture('onboarding_step_completed', { step_name: name, step_number: headerStep });
        } catch {
            /* ignore */
        }
    };

    const onBack = () => {
        Keyboard.dismiss();
        switch (step) {
            case 'language':
                if (navigation.canGoBack()) navigation.goBack();
                else navigation.replace('Welcome');
                break;
            case 'name':
                setStep('language');
                break;
            case 'gender':
                setStep('name');
                break;
            case 'birth':
                setStep('gender');
                break;
            case 'focus':
                setStep('birth');
                useOnboardingStore.setState({
                    focusId: '',
                    relationshipStatus: null,
                    branchId: '',
                    frictionId: '',
                    identityId: '',
                });
                setLoveFlow(false);
                break;
            case 'relationship':
                setStep('focus');
                setLoveFlow(false);
                break;
            case 'friction':
                if (loveFlow) {
                    setStep('relationship');
                    useOnboardingStore.setState({ frictionId: '' });
                } else {
                    setStep('focus');
                    useOnboardingStore.setState({
                        focusId: '',
                        relationshipStatus: null,
                        branchId: '',
                        frictionId: '',
                        identityId: '',
                    });
                }
                break;
            case 'identity':
                setStep('friction');
                useOnboardingStore.setState({ identityId: '' });
                setPendingFrictionId(null);
                break;
            case 'consent':
                setStep('identity');
                break;
            default:
                break;
        }
    };

    const confirmLanguage = async () => {
        await setLanguage(selectedLanguageId);
        capture('language');
        setStep('name');
    };

    const selectGender = (id: string) => {
        setDraftGender(id);
        capture('gender');
        setStep('birth');
    };

    const confirmBirth = () => {
        const iso = formatBirthDate(birthDate);
        setBasicInfo(draftName.trim(), draftGender, iso);
        capture('birth');
        setStep('focus');
    };

    const selectFocus = (id: FocusId) => {
        capture('focus');
        if (id === 'love') {
            setLoveFlow(true);
            setStep('relationship');
            return;
        }
        setLoveFlow(false);
        setFocus(id, null);
        setStep('friction');
    };

    const selectRelationship = (status: RelationshipStatus) => {
        if (!status) return;
        setFocus('love', status);
        capture('relationship');
        setStep('friction');
    };

    const selectFriction = (id: string) => {
        setPendingFrictionId(id);
        capture('friction');
        setStep('identity');
    };

    const selectIdentity = (id: string) => {
        if (!pendingFrictionId) return;
        setPsychology(pendingFrictionId, id);
        capture('identity');
        goConsent();
    };

    const canContinueBirth = draftName.trim().length > 0 && draftGender.length > 0;

    const stepKey = step;

    return (
        <GradientBackground style={styles.root}>
            <SafeAreaView style={styles.safe} edges={['bottom']} pointerEvents="box-none">
                <View style={styles.headerZLayer} pointerEvents="box-none">
                    <OnboardingHeader
                        step={headerStep}
                        totalSteps={totalSteps}
                        onBack={onBack}
                    />
                </View>

                <Animated.View
                    key={stepKey}
                    entering={FadeIn.duration(160)}
                    style={styles.stepWrap}
                    pointerEvents="auto"
                >
                    {step === 'language' && (
                        <View style={styles.stepColumn}>
                            <View style={styles.langHeader}>
                                <View style={styles.iconContainer}>
                                    <Globe color={Colors.primary} size={40} />
                                </View>
                                <View style={styles.titleRowCenter}>
                                    <MysticalText variant="h1" style={styles.titlePlain}>
                                        {t('chooseYour')}
                                    </MysticalText>
                                    <MysticalText variant="h1" style={styles.titleGold}>
                                        {t('languageWord')}
                                    </MysticalText>
                                </View>
                                <MysticalText variant="subtitle" style={styles.subtitleMuted}>
                                    {t('languageSubtitle')}
                                </MysticalText>
                            </View>
                            <ScrollView
                                style={styles.listFlex}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                {LANGUAGES.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => setSelectedLanguageId(item.id)}
                                        activeOpacity={0.7}
                                    >
                                        <GlassCard
                                            style={[
                                                styles.langItem,
                                                selectedLanguageId === item.id && styles.langItemSelected,
                                            ]}
                                            border={selectedLanguageId === item.id}
                                        >
                                            <MysticalText style={styles.langFlag}>{item.flag}</MysticalText>
                                            <MysticalText variant="body" style={styles.langName}>
                                                {item.name}
                                            </MysticalText>
                                            <View
                                                style={[
                                                    styles.radio,
                                                    selectedLanguageId === item.id && styles.radioActive,
                                                ]}
                                            />
                                        </GlassCard>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <View style={styles.footerPadded}>
                                <Button title={t('continue')} onPress={confirmLanguage} />
                            </View>
                        </View>
                    )}

                    {step === 'name' && (
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.stepColumn}
                        >
                            <View style={styles.nameContent}>
                                <View style={styles.titleWrap}>
                                    <MysticalText variant="h1" style={styles.titleLine28}>
                                        {t('nameTitleLine1')}
                                    </MysticalText>
                                    <MysticalText variant="h1" color={Colors.primary} style={styles.titleLine28}>
                                        {t('nameTitleLine2')}
                                    </MysticalText>
                                </View>
                                <MysticalText variant="subtitle" style={styles.subtitle14}>
                                    {t('nameSubtitle')}
                                </MysticalText>
                                <View style={styles.nameInputWrap}>
                                    <TextInput
                                        style={styles.nameInput}
                                        placeholder={t('namePlaceholder')}
                                        placeholderTextColor="rgba(255,255,255,0.3)"
                                        value={draftName}
                                        onChangeText={setDraftName}
                                        autoFocus
                                        autoCapitalize="words"
                                        returnKeyType="done"
                                        onSubmitEditing={() => {
                                            if (draftName.trim()) {
                                                capture('name');
                                                setStep('gender');
                                            }
                                        }}
                                    />
                                    <View style={styles.inputLineThin} />
                                </View>
                            </View>
                            <View style={styles.footerName}>
                                <Button
                                    title={t('continue')}
                                    disabled={!draftName.trim()}
                                    onPress={() => {
                                        capture('name');
                                        setStep('gender');
                                    }}
                                    style={!draftName.trim() ? styles.disabledButton : undefined}
                                />
                            </View>
                        </KeyboardAvoidingView>
                    )}

                    {step === 'gender' && (
                        <ScrollView
                            style={styles.listFlex}
                            contentContainerStyle={styles.scrollPadBottom}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.identityHeader}>
                                <View style={styles.titleRowCenter}>
                                    <MysticalText variant="h1" style={styles.identityTitle}>
                                        {t('identityTitle')}
                                    </MysticalText>
                                    <MysticalText variant="h1" style={styles.identityTitleAccent}>
                                        {' '}
                                        {t('identityTitleAccent')}
                                    </MysticalText>
                                </View>
                                <MysticalText variant="subtitle" style={styles.subtitle14}>
                                    {t('identitySubtitle')}
                                </MysticalText>
                            </View>
                            <View style={styles.optionsGrid}>
                                {GENDER_OPTIONS.map((item) => {
                                    const Icon = item.icon;
                                    const isFullWidth = item.id === 'private';
                                    return (
                                        <Pressable
                                            key={item.id}
                                            onPress={() => selectGender(item.id)}
                                            style={({ pressed }) => [
                                                isFullWidth ? styles.fullWidthOption : styles.halfWidthOption,
                                                pressed && styles.pressedScale,
                                            ]}
                                        >
                                            {({ pressed }) => (
                                                <GlassCard
                                                    style={[styles.genderCard, pressed && styles.genderCardActive]}
                                                    border={pressed}
                                                >
                                                    <View style={[styles.genderIconBox, pressed && styles.genderIconBoxActive]}>
                                                        <Icon
                                                            color={pressed ? Colors.primary : Colors.textSecondary}
                                                            size={24}
                                                        />
                                                    </View>
                                                    <MysticalText variant="body" style={styles.genderLabel}>
                                                        {t(item.labelKey)}
                                                    </MysticalText>
                                                </GlassCard>
                                            )}
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    )}

                    {step === 'birth' && (
                        <View style={styles.stepColumn}>
                            <View style={styles.birthHeader}>
                                <View style={styles.titleWrap}>
                                    <MysticalText variant="h1" style={styles.titleLine28}>
                                        {t('birthdateTitleLine1')}
                                    </MysticalText>
                                    <MysticalText variant="h1" color={Colors.primary} style={styles.titleLine28}>
                                        {t('birthdateTitleLine2')}
                                    </MysticalText>
                                </View>
                                <MysticalText variant="subtitle" style={styles.subtitle14}>
                                    {t('birthdateSubtitle')}
                                </MysticalText>
                            </View>
                            <View style={styles.pickerContainer}>
                                <GlassCard style={styles.dateDisplay}>
                                    <Calendar color={Colors.primary} size={32} style={styles.calendarIcon} />
                                    <MysticalText variant="h2" style={styles.dateTextLarge}>
                                        {birthDate.toLocaleDateString(
                                            localeForLanguage[language] || 'en-US',
                                            { year: 'numeric', month: 'long', day: 'numeric' },
                                        )}
                                    </MysticalText>
                                </GlassCard>
                                <View style={styles.actualPicker}>
                                    <DateTimePicker
                                        value={birthDate}
                                        mode="date"
                                        display="spinner"
                                        onChange={(_, d) => d && setBirthDate(d)}
                                        textColor="#ffffff"
                                        themeVariant="dark"
                                    />
                                </View>
                            </View>
                            <View style={styles.footerPadded}>
                                <Button
                                    title={t('continue')}
                                    disabled={!canContinueBirth}
                                    onPress={confirmBirth}
                                    style={!canContinueBirth ? styles.disabledButton : undefined}
                                />
                            </View>
                        </View>
                    )}

                    {step === 'focus' && (
                        <ScrollView
                            style={styles.listFlex}
                            contentContainerStyle={styles.focusScrollContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.titleWrap}>
                                <MysticalText variant="h1" style={styles.titleLine28}>
                                    {t('focusTitleLine1')}
                                </MysticalText>
                                <MysticalText variant="h1" style={styles.titleLine28}>
                                    <MysticalText variant="h1" color={Colors.primary} style={styles.titleLine28}>
                                        {t('focusTitleLine2')}
                                    </MysticalText>{' '}
                                    {t('focusTitleLine3')}
                                </MysticalText>
                            </View>
                            <MysticalText style={styles.focusSubtitle}>{t('focusSubtitle')}</MysticalText>
                            <View style={styles.focusOptions}>
                                {FOCUS_OPTIONS.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            onPress={() => selectFocus(item.id)}
                                            activeOpacity={0.7}
                                        >
                                            <GlassCard style={styles.focusOptionCard}>
                                                <View style={styles.focusOptionRow}>
                                                    <View style={styles.focusTextPart}>
                                                        <MysticalText variant="body" style={styles.focusOptionTitle}>
                                                            {t(item.labelKey)}
                                                        </MysticalText>
                                                        <MysticalText variant="caption" style={styles.focusOptionSub}>
                                                            {t(item.subKey)}
                                                        </MysticalText>
                                                    </View>
                                                    <View style={styles.focusIconBox}>
                                                        <Icon color={Colors.textSecondary} size={28} />
                                                    </View>
                                                </View>
                                            </GlassCard>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            <MysticalText variant="caption" style={styles.focusFooterNote}>
                                {t('focusFooterNote')}
                            </MysticalText>
                        </ScrollView>
                    )}

                    {step === 'relationship' && (
                        <ScrollView
                            style={styles.listFlex}
                            contentContainerStyle={styles.focusScrollContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.titleWrap}>
                                <MysticalText variant="h1" style={styles.titleLine28}>
                                    {t('relationshipTitleLine1')}
                                </MysticalText>
                                <MysticalText variant="h1" color={Colors.primary} style={styles.titleLine28}>
                                    {t('relationshipTitleLine2')}
                                </MysticalText>
                            </View>
                            <MysticalText style={styles.focusSubtitle}>
                                {t('relationshipSubtitle')}
                            </MysticalText>
                            <View style={styles.focusOptions}>
                                {RELATIONSHIP_OPTIONS.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => selectRelationship(item.id)}
                                        activeOpacity={0.7}
                                    >
                                        <GlassCard style={styles.focusOptionCard}>
                                            <View style={styles.focusOptionRow}>
                                                <View style={styles.focusTextPart}>
                                                    <MysticalText variant="body" style={styles.focusOptionTitle}>
                                                        {t(item.labelKey)}
                                                    </MysticalText>
                                                </View>
                                                <View style={styles.focusIconBox}>
                                                    <Heart color={Colors.textSecondary} size={28} />
                                                </View>
                                            </View>
                                        </GlassCard>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    )}

                    {step === 'friction' && (
                        <ScrollView
                            style={styles.listFlex}
                            contentContainerStyle={styles.focusScrollContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.titleWrap}>
                                <MysticalText variant="h1" style={styles.titleLine28}>
                                    {t('onboardingFrictionTitle1')}
                                </MysticalText>
                                <MysticalText variant="h1" color={Colors.primary} style={styles.titleLine28}>
                                    {t('onboardingFrictionTitle2')}
                                </MysticalText>
                            </View>
                            <MysticalText style={styles.focusSubtitle}>
                                {t('onboardingFrictionSubtitle')}
                            </MysticalText>
                            {branchContent ? (
                                <View style={styles.focusOptions}>
                                    {branchContent.frictions.map((item) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            onPress={() => selectFriction(item.id)}
                                            activeOpacity={0.7}
                                        >
                                            <GlassCard style={styles.focusOptionCard}>
                                                <MysticalText variant="body" style={styles.longOptionText}>
                                                    {t(`onboarding_${item.id}`)}
                                                </MysticalText>
                                            </GlassCard>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.flexCenter}>
                                    <MysticalText variant="body" style={styles.centerTitle}>
                                        {t('onboardingBranchLoading')}
                                    </MysticalText>
                                </View>
                            )}
                        </ScrollView>
                    )}

                    {step === 'identity' && branchContent && (
                        <ScrollView
                            style={styles.listFlex}
                            contentContainerStyle={styles.focusScrollContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.titleWrap}>
                                <MysticalText variant="h1" style={styles.titleLine28}>
                                    {t('onboardingIdentityPickTitle1')}
                                </MysticalText>
                                <MysticalText variant="h1" color={Colors.primary} style={styles.titleLine28}>
                                    {t('onboardingIdentityPickTitle2')}
                                </MysticalText>
                            </View>
                            <MysticalText style={styles.focusSubtitle}>
                                {t('onboardingIdentityPickSubtitle')}
                            </MysticalText>
                            <View style={styles.focusOptions}>
                                {branchContent.identities.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => selectIdentity(item.id)}
                                        activeOpacity={0.7}
                                    >
                                        <GlassCard style={styles.focusOptionCard}>
                                            <MysticalText variant="body" style={styles.longOptionText}>
                                                {t(`onboarding_${item.id}`)}
                                            </MysticalText>
                                        </GlassCard>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    )}

                    {step === 'consent' && (
                        <View style={styles.stepColumn}>
                            <View style={styles.consentHeader}>
                                <View style={styles.consentIconWrap}>
                                    <Sparkles color={Colors.primary} size={32} />
                                </View>
                                <MysticalText variant="h1" style={styles.consentTitle}>
                                    {t('aiConsentTitle')}
                                </MysticalText>
                                <MysticalText variant="subtitle" style={styles.consentSubtitle}>
                                    {t('aiConsentBody')}
                                </MysticalText>
                            </View>
                            <GlassCard style={styles.consentCard}>
                                <MysticalText variant="caption" style={styles.consentCardNote}>
                                    {t('aiConsentNote')}
                                </MysticalText>
                            </GlassCard>
                            <View style={styles.footerAuto}>
                                <Button title={t('aiConsentAccept')} onPress={handleLetsGo} />
                            </View>
                        </View>
                    )}
                </Animated.View>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1 },
    safe: { flex: 1 },
    headerZLayer: { zIndex: 999, elevation: 10, position: 'relative' },
    stepWrap: { flex: 1, paddingHorizontal: 25, paddingBottom: 50 },
    stepColumn: { flex: 1 },
    listFlex: { flex: 1 },

    langHeader: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 8,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleRowCenter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 10,
    },
    titlePlain: { textAlign: 'center' },
    titleGold: { color: Colors.primary, textAlign: 'center' },
    subtitleMuted: {
        textAlign: 'center',
        paddingHorizontal: 20,
        fontSize: 14,
    },
    langItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingVertical: 15,
    },
    langItemSelected: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
    },
    langFlag: { fontSize: 24, marginRight: 15 },
    langName: { flex: 1 },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    radioActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
    },
    footerPadded: { marginTop: 20 },

    nameContent: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 40,
    },
    titleWrap: {
        marginBottom: 10,
        alignItems: 'center',
    },
    titleLine28: {
        textAlign: 'center',
        fontSize: 28,
    },
    subtitle14: {
        fontSize: 14,
        textAlign: 'center',
    },
    nameInputWrap: { marginTop: 4 },
    nameInput: {
        fontSize: 28,
        color: Colors.text,
        paddingVertical: 10,
        fontWeight: '600',
        textAlign: 'center',
    },
    inputLineThin: {
        height: 1,
        backgroundColor: Colors.primary,
        opacity: 0.5,
    },
    footerName: {
        paddingBottom: 40,
        paddingTop: 16,
    },
    disabledButton: { opacity: 0.5 },

    scrollPadBottom: { paddingBottom: 24 },
    identityHeader: {
        marginBottom: 40,
        marginTop: 8,
    },
    identityTitle: {
        fontSize: 28,
        textAlign: 'center',
    },
    identityTitleAccent: {
        color: Colors.primary,
        fontSize: 28,
        textAlign: 'center',
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    halfWidthOption: {
        width: '48%',
        marginBottom: 15,
    },
    fullWidthOption: {
        width: '100%',
        marginBottom: 15,
    },
    pressedScale: {
        opacity: 0.85,
        transform: [{ scale: 0.97 }],
    },
    genderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        height: 80,
    },
    genderCardActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
    },
    genderIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    genderIconBoxActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
    },
    genderLabel: { fontWeight: '600' },

    birthHeader: { marginBottom: 30 },
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
    calendarIcon: { marginRight: 15 },
    dateTextLarge: { fontSize: 22 },
    actualPicker: {
        height: 200,
        justifyContent: 'center',
    },

    focusScrollContent: {
        paddingBottom: 20,
    },
    focusSubtitle: {
        textAlign: 'center',
        color: Colors.textSecondary,
        marginBottom: 35,
    },
    focusOptions: { gap: 15 },
    focusOptionCard: { padding: 20 },
    focusOptionRow: { flexDirection: 'row', alignItems: 'center' },
    focusTextPart: { flex: 1, paddingRight: 10 },
    focusOptionTitle: { fontWeight: '700', fontSize: 18 },
    focusOptionSub: { marginTop: 5, opacity: 0.6 },
    focusIconBox: {
        width: 56,
        height: 56,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    focusFooterNote: {
        textAlign: 'center',
        marginTop: 30,
        opacity: 0.5,
    },
    longOptionText: {
        lineHeight: 22,
        fontWeight: '600',
        fontSize: 16,
    },

    consentHeader: { marginBottom: 24 },
    consentIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    consentTitle: { marginBottom: 12 },
    consentSubtitle: {
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    consentCard: {
        marginBottom: 30,
        padding: 18,
    },
    consentCardNote: {
        color: Colors.textSecondary,
        opacity: 0.9,
        lineHeight: 20,
    },
    footerAuto: { marginTop: 'auto' },

    centerTitle: { textAlign: 'center' },
    flexCenter: { minHeight: 200, justifyContent: 'center', alignItems: 'center' },
});
