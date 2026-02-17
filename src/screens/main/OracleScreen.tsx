import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Send, Sparkles } from 'lucide-react-native';
import { AIService } from '../../services/ai';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Oracle'>;

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'oracle';
}

export const OracleScreen: React.FC<Props> = ({ route }) => {
    const { lifePath, language } = route.params;
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Greetings, seeker. I am the Oracle. What wisdom do you seek today?", sender: 'oracle' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async (text: string) => {
        if (!text.trim() || loading) return;

        const userMsg: Message = { id: Date.now().toString(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await AIService.generateOracleResponse(text, lifePath, language);
            const oracleMsg: Message = { id: (Date.now() + 1).toString(), text: response, sender: 'oracle' };
            setMessages(prev => [...prev, oracleMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safe}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    <View style={styles.header}>
                        <Sparkles color={Colors.primary} size={24} />
                        <MysticalText variant="h2">AI Oracle</MysticalText>
                    </View>

                    <ScrollView
                        style={styles.chatArea}
                        contentContainerStyle={styles.chatContent}
                        showsVerticalScrollIndicator={false}
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
                                </GlassCard>
                            </View>
                        ))}
                        {loading && (
                            <View style={styles.oracleWrapper}>
                                <GlassCard style={styles.oracleCard}>
                                    <MysticalText style={styles.messageText}>The Oracle is channeling...</MysticalText>
                                </GlassCard>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.inputArea}>
                        <View style={styles.presets}>
                            <PresetBtn text="Full analysis" onPress={() => handleSend("Give me a full numerological analysis.")} />
                            <PresetBtn text="Love life" onPress={() => handleSend("What does my love life look like?")} />
                            <PresetBtn text="Career path" onPress={() => handleSend("What is my ideal career path?")} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Ask your question..."
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={input}
                                onChangeText={setInput}
                                multiline
                            />
                            <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend(input)}>
                                <Send color="#0a0612" size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
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
});
