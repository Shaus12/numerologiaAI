import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { UserPlus, Heart, Users, User, Briefcase, ChevronRight, Calendar } from 'lucide-react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';
import { useVault } from '../../context/VaultContext';
import { useRevenueCat } from '../../context/RevenueCatContext';
import { useSettings } from '../../context/SettingsContext';
import type { SavedConnection, RelationshipType } from '../../types/vault';
import DateTimePicker from '@react-native-community/datetimepicker';
import { localeForLanguage } from '../../utils/translations';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 60;

function getModalSheetHeight(bottomInset: number) {
    const menuHeight = TAB_BAR_HEIGHT + bottomInset + 8;
    return Math.min(WINDOW_HEIGHT - menuHeight, WINDOW_HEIGHT * 0.92, 680);
}

const RELATIONSHIP_OPTIONS: { type: RelationshipType; labelKey: string; Icon: typeof Heart }[] = [
    { type: 'Romantic', labelKey: 'relationshipRomantic', Icon: Heart },
    { type: 'Colleague', labelKey: 'relationshipColleague', Icon: Briefcase },
    { type: 'Family', labelKey: 'relationshipFamily', Icon: Users },
    { type: 'Friend', labelKey: 'relationshipFriend', Icon: User },
];

type Props = BottomTabScreenProps<MainTabParamList, 'Vault'>;

export const VaultScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { t, language } = useSettings();
    const { connections, isLoading, addConnection } = useVault();
    const { isPro } = useRevenueCat();
    const modalSheetHeight = getModalSheetHeight(insets.bottom);

    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [birthdate, setBirthdate] = useState(new Date(1990, 0, 1));
    const [relationshipType, setRelationshipType] = useState<RelationshipType>('Friend');
    const [showDatePicker, setShowDatePicker] = useState(false);

    // On Android, close date picker when leaving this screen so it doesn't appear when changing language in Settings
    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setShowDatePicker(false);
            };
        }, [])
    );

    const locale = localeForLanguage[language as keyof typeof localeForLanguage] || 'en-US';
    const parentNav = navigation.getParent() as any;

    const handleAddPress = () => {
        if (!isPro && connections.length >= 1) {
            parentNav?.navigate('Paywall');
            return;
        }
        setModalVisible(true);
    };

    const handleSaveConnection = async () => {
        const trimmedName = name.trim();
        if (!trimmedName) return;
        const newConnection = await addConnection({
            name: trimmedName,
            birthdate: birthdate.toISOString(),
            relationshipType,
        });
        setName('');
        setBirthdate(new Date(1990, 0, 1));
        setRelationshipType('Friend');
        setShowDatePicker(false);
        setModalVisible(false);
        if (newConnection) {
            parentNav?.navigate('ConnectionReading', { connectionId: newConnection.id });
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        setShowDatePicker(false);
    };

    const openReading = (connection: SavedConnection) => {
        parentNav?.navigate('ConnectionReading', { connectionId: connection.id });
    };

    if (isLoading) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container}>
                    <MysticalText variant="body" style={styles.loadingText}>{t('loading')}</MysticalText>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <MysticalText variant="h1" style={styles.title}>{t('vaultTitle')}</MysticalText>
                        <MysticalText variant="body" style={styles.subtitle}>{t('vaultSubtitle')}</MysticalText>
                    </View>

                    {connections.length === 0 ? (
                        <View style={styles.emptyState}>
                            <UserPlus color={Colors.textSecondary} size={48} />
                            <MysticalText variant="body" style={styles.emptyText}>
                                {t('addConnection')}
                            </MysticalText>
                            <MysticalText variant="caption" style={styles.emptySub}>
                                {!isPro ? t('vaultPaywallMessage') : ''}
                            </MysticalText>
                        </View>
                    ) : (
                        <View style={styles.list}>
                            {connections.map((conn) => (
                                <TouchableOpacity
                                    key={conn.id}
                                    activeOpacity={0.8}
                                    onPress={() => openReading(conn)}
                                >
                                    <GlassCard style={styles.card}>
                                        <View style={styles.cardContent}>
                                            <View style={styles.cardLeft}>
                                                <MysticalText variant="body" style={styles.cardName} numberOfLines={1} ellipsizeMode="tail">{conn.name}</MysticalText>
                                                <MysticalText variant="caption" style={styles.cardMeta} numberOfLines={1} ellipsizeMode="tail">
                                                    {conn.relationshipType} · {new Date(conn.birthdate).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </MysticalText>
                                            </View>
                                            <ChevronRight color={Colors.textSecondary} size={22} />
                                        </View>
                                    </GlassCard>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </ScrollView>

                <TouchableOpacity
                    style={styles.fab}
                    onPress={handleAddPress}
                    activeOpacity={0.9}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                    <View pointerEvents="none">
                        <UserPlus color="#0a0612" size={28} />
                    </View>
                </TouchableOpacity>

                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={closeModal}
                    statusBarTranslucent
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={[styles.modalOverlay, { marginBottom: TAB_BAR_HEIGHT + insets.bottom }]}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'height' : undefined}
                                style={styles.modalKeyboardView}
                                keyboardVerticalOffset={0}
                            >
                                <TouchableWithoutFeedback onPress={() => {}}>
                                    <View style={[styles.modalContentWrap, { maxHeight: modalSheetHeight }]}>
                                        <GlassCard style={styles.modalCard}>
                                            <ScrollView
                                                style={styles.modalScroll}
                                                contentContainerStyle={styles.modalScrollContent}
                                                keyboardShouldPersistTaps="handled"
                                                showsVerticalScrollIndicator={false}
                                                bounces={false}
                                            >
                                                <MysticalText variant="h2" style={styles.modalTitle}>{t('addConnection')}</MysticalText>

                                                <MysticalText variant="caption" style={styles.fieldLabel}>{t('connectionName')}</MysticalText>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder={t('connectionName')}
                                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                                    value={name}
                                                    onChangeText={setName}
                                                    autoCapitalize="words"
                                                />

                                                <MysticalText variant="caption" style={styles.fieldLabel}>{t('connectionBirthdate')}</MysticalText>
                                                <TouchableOpacity
                                                    style={styles.dateTouchable}
                                                    onPress={() => setShowDatePicker((v) => !v)}
                                                    activeOpacity={0.8}
                                                >
                                                    <Calendar color={Colors.primary} size={20} />
                                                    <MysticalText variant="body" style={styles.dateDisplayText}>
                                                        {birthdate.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </MysticalText>
                                                </TouchableOpacity>

                                                {showDatePicker && (
                                                    <View style={styles.datePickerWrap}>
                                                        <DateTimePicker
                                                            value={birthdate}
                                                            mode="date"
                                                            display={Platform.OS === 'android' ? 'default' : 'spinner'}
                                                            onChange={(_, d) => {
                                                                if (d) setBirthdate(d);
                                                                if (Platform.OS === 'android') setShowDatePicker(false);
                                                            }}
                                                            textColor="#fff"
                                                            themeVariant="dark"
                                                        />
                                                    </View>
                                                )}

                                                <MysticalText variant="caption" style={styles.fieldLabel}>{t('relationshipType')}</MysticalText>
                                                <View style={styles.relationshipRow}>
                                                    {RELATIONSHIP_OPTIONS.map(({ type, labelKey, Icon }) => (
                                                        <TouchableOpacity
                                                            key={type}
                                                            style={[styles.relationChip, relationshipType === type && styles.relationChipActive]}
                                                            onPress={() => setRelationshipType(type)}
                                                            activeOpacity={0.8}
                                                        >
                                                            <Icon color={relationshipType === type ? Colors.primary : Colors.textSecondary} size={18} />
                                                            <MysticalText variant="caption" style={[styles.relationLabel, relationshipType === type && styles.relationLabelActive]}>
                                                                {t(labelKey)}
                                                            </MysticalText>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>

                                                <View style={styles.modalActions}>
                                                    <Button title={t('cancel')} variant="outline" onPress={closeModal} style={styles.modalBtn} />
                                                    <Button title={t('saveConnection')} variant="primary" onPress={handleSaveConnection} style={styles.modalBtn} disabled={!name.trim()} />
                                                </View>
                                            </ScrollView>
                                        </GlassCard>
                                    </View>
                                </TouchableWithoutFeedback>
                            </KeyboardAvoidingView>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 24, paddingBottom: 100 },
    header: { marginBottom: 24 },
    title: { marginBottom: 8 },
    subtitle: { opacity: 0.8 },
    loadingText: { textAlign: 'center', marginTop: 40 },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyText: { opacity: 0.9 },
    emptySub: { opacity: 0.6, textAlign: 'center' },
    list: { gap: 12 },
    card: { padding: 16 },
    cardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardLeft: { flex: 1, minWidth: 0 },
    cardName: { fontWeight: '700', marginBottom: 4 },
    cardMeta: { opacity: 0.7, writingDirection: 'ltr' },
    fab: {
        position: 'absolute',
        bottom: 88,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 100,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.82)',
        justifyContent: 'flex-end',
    },
    modalKeyboardView: {
        width: '100%',
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContentWrap: {
        width: '100%',
        flex: 1,
    },
    modalCard: {
        flex: 1,
        margin: 16,
        marginBottom: 40,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: '#120d1a',
        borderColor: 'rgba(212, 175, 55, 0.25)',
    },
    modalScroll: {
        flex: 1,
    },
    modalScrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    modalTitle: { marginBottom: 14 },
    fieldLabel: { marginBottom: 4, opacity: 0.8 },
    input: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 12,
        color: Colors.text,
        fontSize: 16,
        marginBottom: 14,
    },
    dateTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginBottom: 10,
    },
    dateDisplayText: { flex: 1 },
    datePickerWrap: {
        marginBottom: 14,
        alignItems: 'center',
    },
    relationshipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
    relationChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    relationChipActive: { borderColor: Colors.primary, backgroundColor: 'rgba(212, 175, 55, 0.12)' },
    relationLabel: { color: Colors.textSecondary },
    relationLabelActive: { color: Colors.primary },
    modalActions: { flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 8 },
    modalBtn: { flex: 1 },
});
