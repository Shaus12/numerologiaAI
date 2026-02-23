import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const RELATIONSHIP_OPTIONS: { type: RelationshipType; labelKey: string; Icon: typeof Heart }[] = [
    { type: 'Romantic', labelKey: 'relationshipRomantic', Icon: Heart },
    { type: 'Colleague', labelKey: 'relationshipColleague', Icon: Briefcase },
    { type: 'Family', labelKey: 'relationshipFamily', Icon: Users },
    { type: 'Friend', labelKey: 'relationshipFriend', Icon: User },
];

type Props = BottomTabScreenProps<MainTabParamList, 'Vault'>;

export const VaultScreen: React.FC<Props> = ({ navigation }) => {
    const { t, language } = useSettings();
    const { connections, isLoading, addConnection } = useVault();
    const { isPro, presentPaywall } = useRevenueCat();

    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [birthdate, setBirthdate] = useState(new Date(1990, 0, 1));
    const [relationshipType, setRelationshipType] = useState<RelationshipType>('Friend');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const locale = localeForLanguage[language as keyof typeof localeForLanguage] || 'en-US';
    const parentNav = navigation.getParent() as any;

    const handleAddPress = () => {
        if (!isPro && connections.length >= 1) {
            presentPaywall();
            return;
        }
        setModalVisible(true);
    };

    const handleSaveConnection = async () => {
        const trimmedName = name.trim();
        if (!trimmedName) return;
        await addConnection({
            name: trimmedName,
            birthdate: birthdate.toISOString(),
            relationshipType,
        });
        setName('');
        setBirthdate(new Date(1990, 0, 1));
        setRelationshipType('Friend');
        setShowDatePicker(false);
        setModalVisible(false);
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
                                                <MysticalText variant="body" style={styles.cardName}>{conn.name}</MysticalText>
                                                <MysticalText variant="caption" style={styles.cardMeta}>
                                                    {conn.relationshipType} · {new Date(conn.birthdate).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </MysticalText>
                                                {conn.cachedReading ? (
                                                    <MysticalText variant="caption" style={styles.cachedBadge}>{t('vaultReadingSaved')}</MysticalText>
                                                ) : null}
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
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalOverlay}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                style={styles.modalKeyboardView}
                                keyboardVerticalOffset={0}
                            >
                                <TouchableWithoutFeedback onPress={() => {}}>
                                    <View style={styles.modalContentWrap}>
                                        <GlassCard style={styles.modalCard}>
                                            <ScrollView
                                                style={styles.modalScroll}
                                                contentContainerStyle={styles.modalScrollContent}
                                                keyboardShouldPersistTaps="handled"
                                                showsVerticalScrollIndicator={false}
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
    cardLeft: { flex: 1 },
    cardName: { fontWeight: '700', marginBottom: 4 },
    cardMeta: { opacity: 0.7 },
    cachedBadge: { marginTop: 4, color: Colors.primary, fontSize: 11 },
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
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalKeyboardView: {
        maxHeight: '90%',
    },
    modalContentWrap: {
        maxHeight: '90%',
    },
    modalCard: {
        margin: 16,
        marginBottom: 34,
        padding: 0,
        overflow: 'hidden',
        maxHeight: '90%',
    },
    modalScroll: {
        maxHeight: 440,
    },
    modalScrollContent: {
        padding: 24,
        paddingBottom: 28,
    },
    modalTitle: { marginBottom: 20 },
    fieldLabel: { marginBottom: 6, opacity: 0.8 },
    input: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 14,
        color: Colors.text,
        fontSize: 16,
        marginBottom: 20,
    },
    dateTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginBottom: 12,
    },
    dateDisplayText: { flex: 1 },
    datePickerWrap: {
        marginBottom: 20,
        alignItems: 'center',
    },
    relationshipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
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
    modalActions: { flexDirection: 'row', gap: 12 },
    modalBtn: { flex: 1 },
});
