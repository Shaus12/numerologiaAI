import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Star, User, Calendar, Target, Camera, CreditCard } from 'lucide-react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';
import * as ImagePicker from 'expo-image-picker';
import { useRevenueCat } from '../../context/RevenueCatContext';

type Props = BottomTabScreenProps<MainTabParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ route }) => {
    const {
        name,
        lifePath,
        destiny,
        soulUrge,
        personality,
        personalYear,
        dailyNumber,
        language
    } = route.params || {};

    const [image, setImage] = React.useState<string | null>(null);
    const { isPro, presentPaywall, presentCustomerCenter } = useRevenueCat();

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'We need access to your gallery to upload a profile picture.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <GradientBackground style={styles.container}>
            <SafeAreaView style={styles.safe}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.avatarBorder}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.avatarImage} />
                            ) : (
                                <View style={styles.avatar}>
                                    <User color={Colors.primary} size={40} />
                                </View>
                            )}
                            <View style={styles.badge}>
                                <Camera color="#000" size={12} />
                            </View>
                        </TouchableOpacity>
                        <MysticalText variant="h2" style={styles.name}>{name || 'Seeker'}</MysticalText>

                        {isPro ? (
                            <TouchableOpacity style={styles.premiumLabel} onPress={presentCustomerCenter}>
                                <Star color={Colors.primary} size={16} fill={Colors.primary} />
                                <MysticalText style={styles.premiumText}>Premium Member</MysticalText>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.upgradeButton} onPress={presentPaywall}>
                                <Star color="#FFF" size={16} strokeWidth={2.5} />
                                <MysticalText style={styles.upgradeText}>Upgrade to Pro</MysticalText>
                            </TouchableOpacity>
                        )}
                    </View>

                    {isPro && (
                        <TouchableOpacity style={styles.manageSubButton} onPress={presentCustomerCenter}>
                            <CreditCard color={Colors.textSecondary} size={16} />
                            <MysticalText style={styles.manageSubText}>Manage Subscription</MysticalText>
                        </TouchableOpacity>
                    )}

                    <View style={styles.detailsSection}>
                        <DetailItem icon={User} label="Language" value={language || 'English'} />
                        <DetailItem icon={Calendar} label="Personal Year" value={personalYear?.toString() || '0'} />
                        <DetailItem icon={Target} label="Daily Focus" value={`Vibration ${dailyNumber || 0}`} />
                    </View>

                    <View style={styles.numbersSection}>
                        <MysticalText variant="subtitle" style={styles.sectionTitle}>YOUR CORE NUMBERS</MysticalText>
                        <View style={styles.grid}>
                            <CoreNumber label="Life Path" value={lifePath?.toString() || '0'} />
                            <CoreNumber label="Destiny" value={destiny?.toString() || '0'} color={Colors.secondary} />
                            <CoreNumber label="Soul Urge" value={soulUrge?.toString() || '0'} color="#3498db" />
                            <CoreNumber label="Personality" value={personality?.toString() || '0'} color="#e74c3c" />
                            <CoreNumber label="Daily" value={dailyNumber?.toString() || '0'} color="#2ecc71" />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
};

const DetailItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <GlassCard style={styles.detailItem}>
        <View style={styles.iconBox}>
            <Icon color={Colors.primary} size={20} />
        </View>
        <View>
            <MysticalText variant="caption" style={styles.detailLabel}>{label}</MysticalText>
            <MysticalText variant="body" style={styles.detailValue}>{value}</MysticalText>
        </View>
    </GlassCard>
);

const CoreNumber = ({ label, value, color = Colors.primary }: { label: string; value: string; color?: string }) => (
    <GlassCard style={styles.numberCard}>
        <MysticalText style={[styles.numberValue, { color }]}>{value}</MysticalText>
        <MysticalText variant="caption" style={styles.numberLabel}>{label}</MysticalText>
    </GlassCard>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    safe: { flex: 1 },
    scroll: { padding: 25 },
    header: { alignItems: 'center', marginBottom: 20 },
    avatarBorder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    badge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.background,
    },
    name: { marginBottom: 12 },
    premiumLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    premiumText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
    upgradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        gap: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    upgradeText: { color: '#000', fontWeight: '700', fontSize: 14 },
    manageSubButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 20,
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        alignSelf: 'center',
    },
    manageSubText: { color: Colors.textSecondary, fontSize: 12 },
    detailsSection: { gap: 12, marginBottom: 30 },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 15,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailLabel: { opacity: 0.6 },
    detailValue: { fontWeight: '700' },
    numbersSection: {},
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textSecondary,
        letterSpacing: 2,
        marginBottom: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    numberCard: {
        width: '31%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    numberValue: { fontSize: 28, fontWeight: '700' },
    numberLabel: { marginTop: 4, textAlign: 'center' },
});
