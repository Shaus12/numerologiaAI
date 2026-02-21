import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { Send, Sparkles, Lock, ArrowLeft, Share, History, X } from 'lucide-react-native';
import { Share as RNShare } from 'react-native';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { AIService } from '../../services/ai';
import { useSettings } from '../../context/SettingsContext';
import { useRevenueCat } from '../../context/RevenueCatContext';
import { useUser } from '../../context/UserContext';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

type Props = CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, 'Oracle'>,
    StackScreenProps<RootStackParamList>
>;

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'oracle';
}

export const OracleScreen: React.FC<Props> = ({ route, navigation }) => {
    const { language, t } = useSettings();
    const { isPro } = useRevenueCat();
    const { userProfile, numerologyResults } = useUser();

    // Use context (persistent) data as primary, route.params as fallback
    const lifePath = numerologyResults?.lifePath ?? route.params?.lifePath ?? 0;

    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: t('oracleGreeting'), sender: 'oracle' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<{ question: string, answer: string }[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [cooldown, setCooldown] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const saved = await AsyncStorage.getItem('oracle_history');
            if (saved) {
                setHistory(JSON.parse(saved));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const saveToHistory = async (question: string, answer: string) => {
        try {
            const newEntry = { question, answer };
            const updated = [newEntry, ...history].slice(0, 5);
            setHistory(updated);
            await AsyncStorage.setItem('oracle_history', JSON.stringify(updated));
        } catch (e) {
            console.error(e);
        }
    };

    const handleShare = async (text: string) => {
        try {
            const message = `Check out my mystical reading from Numerologia AI:\n\n"${text}"\n\nDownload the app to discover your destiny!`;
            await RNShare.share({
                message,
                title: 'Mystical Reading from Numerologia AI'
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleSend = async (text: string) => {
        if (!text.trim() || loading || cooldown) return;

        const userMsg: Message = { id: Date.now().toString(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setCooldown(true);

        setTimeout(() => {
            setCooldown(false);
        }, 3000);

        try {
            const response = await AIService.generateOracleResponse(text, lifePath, language);
            const oracleMsg: Message = { id: (Date.now() + 1).toString(), text: response, sender: 'oracle' };
            setMessages(prev => [...prev, oracleMsg]);
            saveToHistory(text, response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigation.navigate('Home', {
            name: userProfile?.name ?? '',
            language: language,
            reading: numerologyResults?.reading ?? '',
            lifePath: lifePath,
            destiny: numerologyResults?.destiny ?? 0,
            soulUrge: numerologyResults?.soulUrge ?? 0,
            personality: numerologyResults?.personality ?? 0,
            personalYear: numerologyResults?.personalYear ?? 0,
            dailyNumber: numerologyResults?.dailyNumber ?? 0,
        });
    };

    if (!isPro) {
        return <OraclePaywallOverlay onBack={handleBack} />;
    }

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    <View style={{ flex: 1 }}>
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={() => setShowHistory(true)}
                                style={styles.historyBtn}
                                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                            >
                                <History color={Colors.textSecondary} size={24} />
                            </TouchableOpacity>
                            <View style={styles.headerTitle}>
                                <Sparkles color={Colors.primary} size={24} />
                                <MysticalText variant="h2">AI Oracle</MysticalText>
                            </View>
                            <View style={{ width: 24 }} />
                        </View>

                        <ScrollView
                            style={styles.chatArea}
                            contentContainerStyle={styles.chatContent}
                            showsVerticalScrollIndicator={false}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps="handled"
                        >
                            {messages.map((msg) => (
                                <View key={msg.id} style={[
                                    styles.messageWrapper,
                                    msg.sender === 'user' ? styles.userWrapper : styles.oracleWrapper
                                ]}>
                                    <GlassCard style={[
                                        styles.messageCard,
                                        msg.sender === 'user' ? styles.userCard : styles.oracleCard
                                    ]}>
                                        <MysticalText style={styles.messageText}>{msg.text}</MysticalText>
                                        {msg.sender === 'oracle' && (
                                            <TouchableOpacity
                                                style={styles.shareBtn}
                                                onPress={() => handleShare(msg.text)}
                                            >
                                                <Share size={14} color={Colors.textSecondary} />
                                            </TouchableOpacity>
                                        )}
                                    </GlassCard>
                                </View>
                            ))}
                            {loading && (
                                <View style={styles.oracleWrapper}>
                                    <GlassCard style={styles.oracleCard}>
                                        <MysticalText style={styles.messageText}>{t('oracleChanneling')}</MysticalText>
                                    </GlassCard>
                                </View>
                            )}
                        </ScrollView>

                        <View style={styles.inputArea}>
                            <View style={styles.presets}>
                                <PresetBtn text={t('presetAnalysis')} onPress={() => handleSend("Give me a full numerological analysis.")} />
                                <PresetBtn text={t('presetLove')} onPress={() => handleSend("What does my love life look like?")} />
                                <PresetBtn text={t('presetCareer')} onPress={() => handleSend("What is my ideal career path?")} />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('inputPlaceholder')}
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={input}
                                    onChangeText={setInput}
                                    multiline
                                    editable={!loading && !cooldown}
                                />
                                <TouchableOpacity
                                    style={[styles.sendBtn, (loading || cooldown) && { opacity: 0.5 }]}
                                    onPress={() => handleSend(input)}
                                    disabled={loading || cooldown}
                                >
                                    <Send color="#0a0612" size={20} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>

                <Modal
                    visible={showHistory}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowHistory(false)}
                >
                    <View style={styles.modalOverlay}>
                        <GlassCard style={styles.historyModal}>
                            <View style={styles.modalHeader}>
                                <MysticalText variant="subtitle" style={styles.modalTitle}>{t('recentQuestions') || 'Recent Questions'}</MysticalText>
                                <TouchableOpacity onPress={() => setShowHistory(false)}>
                                    <X color={Colors.textSecondary} size={24} />
                                </TouchableOpacity>
                            </View>

                            {history.length === 0 ? (
                                <MysticalText style={styles.emptyHistory}>{t('noHistory') || 'The mists of time are clear...'}</MysticalText>
                            ) : (
                                <FlatList
                                    data={history}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.historyItem}>
                                            <MysticalText variant="caption" style={styles.historyQ}>Q: {item.question}</MysticalText>
                                            <MysticalText style={styles.historyA}>A: {item.answer}</MysticalText>
                                        </View>
                                    )}
                                    contentContainerStyle={styles.historyList}
                                />
                            )}
                        </GlassCard>
                    </View>
                </Modal>
            </SafeAreaView>
        </GradientBackground>
    );
};

const OraclePaywallOverlay = ({ onBack }: { onBack: () => void }) => {
    const { presentPaywall } = useRevenueCat();

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safe}>
                <View style={styles.paywallContainer}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <ArrowLeft color={Colors.textSecondary} size={24} />
                        <MysticalText style={styles.backText}>Back to Home</MysticalText>
                    </TouchableOpacity>

                    <View style={styles.paywallContent}>
                        <View style={styles.lockIconContainer}>
                            <Lock color={Colors.primary} size={50} />
                        </View>

                        <MysticalText variant="h2" style={styles.paywallTitle}>
                            Unlock the Oracle
                        </MysticalText>

                        <MysticalText style={styles.paywallSubtitle}>
                            Start your 7-day free trial to consult the Oracle and reveal your destiny.
                        </MysticalText>

                        <View style={styles.offerContainer}>
                            <Button
                                title="Start Your 7-Day Free Trial"
                                onPress={presentPaywall}
                                style={styles.paywallBtn}
                            />
                            <MysticalText variant="caption" style={styles.cancelText}>
                                Cancel anytime.
                            </MysticalText>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
};


const PresetBtn = ({ text, onPress }: { text: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.presetBtn} onPress={onPress}>
        <MysticalText variant="caption" style={styles.presetText}>{text}</MysticalText>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    safe: { flex: 1 },
    keyboardView: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    chatArea: { flex: 1 },
    chatContent: { padding: 20 },
    messageWrapper: {
        marginBottom: 15,
        maxWidth: '85%',
    },
    userWrapper: { alignSelf: 'flex-end' },
    oracleWrapper: { alignSelf: 'flex-start' },
    messageCard: {
        padding: 12,
        borderRadius: 18,
    },
    userCard: {
        backgroundColor: Colors.primary,
        borderTopRightRadius: 2,
    },
    oracleCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderTopLeftRadius: 2,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    inputArea: {
        padding: 20,
        backgroundColor: 'rgba(10, 6, 18, 0.8)',
    },
    presets: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 15,
    },
    presetBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    presetText: { fontSize: 11 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: '#fff',
        fontSize: 15,
        maxHeight: 100,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Paywall Overlay Styles
    paywallContainer: {
        flex: 1,
        padding: 25,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        gap: 10,
    },
    backText: {
        color: Colors.textSecondary,
        fontSize: 16,
    },
    paywallContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    lockIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    paywallTitle: {
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 28,
    },
    paywallSubtitle: {
        textAlign: 'center',
        color: Colors.textSecondary,
        marginBottom: 40,
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    offerContainer: {
        width: '100%',
        alignItems: 'center',
    },
    priceText: {
        marginBottom: 15,
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    paywallBtn: {
        width: '100%',
        marginBottom: 15,
    },
    cancelText: {
        opacity: 0.6,
    },
    shareBtn: {
        alignSelf: 'flex-end',
        padding: 5,
        marginTop: 5,
    },
    // History Modal
    historyBtn: {
        padding: 5,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        padding: 20,
    },
    historyModal: {
        maxHeight: '70%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        color: Colors.primary,
    },
    historyList: {
        gap: 15,
    },
    historyItem: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    historyQ: {
        color: Colors.textSecondary,
        marginBottom: 5,
        fontStyle: 'italic',
    },
    historyA: {
        fontSize: 14,
        lineHeight: 20,
    },
    emptyHistory: {
        textAlign: 'center',
        opacity: 0.6,
        padding: 20,
    }
});
