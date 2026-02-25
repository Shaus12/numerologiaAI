import React, { useState, useMemo, useEffect, useRef } from 'react';
import { InteractionManager, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RevenueCatProvider } from './src/context/RevenueCatContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from './src/navigation/types';
import { SplashScreen } from './src/screens/onboarding/SplashScreen';
import { WelcomeScreen } from './src/screens/onboarding/WelcomeScreen';
import { LanguageScreen } from './src/screens/onboarding/LanguageScreen';
import { IdentityScreen } from './src/screens/onboarding/IdentityScreen';
import { NameScreen } from './src/screens/onboarding/NameScreen';
import { BirthdateScreen } from './src/screens/onboarding/BirthdateScreen';
import { BirthTimeScreen } from './src/screens/onboarding/BirthTimeScreen';
import { EnterBirthTimeScreen } from './src/screens/onboarding/EnterBirthTimeScreen';
import { RelationshipScreen } from './src/screens/onboarding/RelationshipScreen';
import { FocusScreen } from './src/screens/onboarding/FocusScreen';
import { ChallengeScreen } from './src/screens/onboarding/ChallengeScreen';
import { ExpectationsScreen } from './src/screens/onboarding/ExpectationsScreen';
import { AIConsentScreen } from './src/screens/onboarding/AIConsentScreen';
import { CalculatingScreen } from './src/screens/onboarding/CalculatingScreen';
import { AnalysisCompleteScreen } from './src/screens/onboarding/AnalysisCompleteScreen';
import { HomeScreen } from './src/screens/main/HomeScreen';
import { OracleScreen } from './src/screens/main/OracleScreen';
import { MapScreen } from './src/screens/main/MapScreen';
import { ProfileScreen } from './src/screens/main/ProfileScreen';
import { VaultScreen } from './src/screens/main/VaultScreen';
import { ConnectionReadingScreen } from './src/screens/main/ConnectionReadingScreen';
import { PaywallScreen } from './src/screens/main/PaywallScreen';
import { StatusBar } from 'expo-status-bar';
import { Colors } from './src/constants/Colors';
import { Home, Sparkles, Map, User, Lock } from 'lucide-react-native';
import { UserProvider, useUser } from './src/context/UserContext';
import { VaultProvider } from './src/context/VaultContext';
import { useRevenueCat } from './src/context/RevenueCatContext';
import { useSettings } from './src/context/SettingsContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { SettingsScreen } from './src/screens/settings/SettingsScreen';
import { PrivacyPolicyScreen } from './src/screens/legal/PrivacyPolicyScreen';
import { TermsOfUseScreen } from './src/screens/legal/TermsOfUseScreen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator({ route }: any) {
  const results = route.params || {};
  const insets = useSafeAreaInsets();
  const { language, t, isRTL } = useSettings();

  const tabLabel = (name: string) => {
    if (name === 'Home') return t('tabHome');
    if (name === 'Oracle') return t('tabOracle');
    if (name === 'Map') return t('tabMap');
    if (name === 'Vault') return t('tabVault');
    if (name === 'Profile') return t('tabProfile');
    return name;
  };

  return (
    <Tab.Navigator
      key={language}
      screenOptions={({ route: r }) => ({
        headerShown: false,
        tabBarLabel: tabLabel(r.name),
        tabBarStyle: {
          backgroundColor: '#0a0612',
          borderTopColor: 'rgba(255,255,255,0.05)',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          ...(isRTL ? { direction: 'rtl' } : {}),
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarIcon: ({ color, size }) => {
          let icon;
          if (r.name === 'Home') icon = <Home color={color} size={size} />;
          else if (r.name === 'Oracle') icon = <Sparkles color={color} size={size} />;
          else if (r.name === 'Map') icon = <Map color={color} size={size} />;
          else if (r.name === 'Vault') icon = <Lock color={color} size={size} />;
          else icon = <User color={color} size={size} />;
          return <View pointerEvents="none">{icon}</View>;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={results}
      />
      <Tab.Screen
        name="Oracle"
        component={OracleScreen}
        initialParams={{ lifePath: results.lifePath, language: results.language }}
      />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Vault" component={VaultScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={results}
      />
    </Tab.Navigator>
  );
}

const MainTabs = (props: any) => <MainTabNavigator {...props} />;
const CalculatingScreenWrapper = ({ route, navigation }: any) => {
  const { userData } = route.params;
  return (
    <CalculatingScreen
      userData={userData}
      onFinish={(results: any) => {
        navigation.replace('AnalysisComplete', results);
      }}
    />
  );
};

const AppContent = (props: { navigationRef: any }) => {
  const [userData, setUserData] = useState<any>({});
  const userDataRef = useRef(userData);
  userDataRef.current = userData;

  const { userProfile, numerologyResults, isLoading: isUserLoading } = useUser();
  const { isLoading: isRcLoading } = useRevenueCat();
  const [splashFinished, setSplashFinished] = useState(false);

  // Buffer heavy context changes to avoid UI lockup during startup
  const [ready, setReady] = useState(false);
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setReady(true);
    });
  }, []);

  // Memoize stable component references to prevent unmounting on AppContent re-renders
  const WelcomeComponent = useMemo(() => (props: any) => (
    <WelcomeScreen onStart={() => props.navigation.navigate('Language')} />
  ), []);

  const LanguageComponent = useMemo(() => (props: any) => (
    <LanguageScreen
      onContinue={(lang: any) => {
        setUserData((prev: any) => ({ ...prev, language: lang }));
        props.navigation.navigate('Identity');
      }}
    />
  ), []);

  const IdentityComponent = useMemo(() => (props: any) => (
    <IdentityScreen
      onBack={() => props.navigation.goBack()}
      onContinue={(identity: any) => {
        setUserData((prev: any) => ({ ...prev, identity }));
        props.navigation.navigate('Name');
      }}
    />
  ), []);

  const NameComponent = useMemo(() => (props: any) => (
    <NameScreen
      onBack={() => props.navigation.goBack()}
      onContinue={(name: any) => {
        setUserData((prev: any) => ({ ...prev, name }));
        props.navigation.navigate('BirthTime');
      }}
    />
  ), []);

  const BirthTimeComponent = useMemo(() => (props: any) => (
    <BirthTimeScreen
      onContinue={(knowsTime: any) => {
        if (knowsTime) {
          props.navigation.navigate('EnterBirthTime');
        } else {
          setUserData((prev: any) => ({ ...prev, knowsBirthTime: false }));
          props.navigation.navigate('Relationship');
        }
      }}
    />
  ), []);

  const EnterBirthTimeComponent = useMemo(() => (props: any) => (
    <EnterBirthTimeScreen
      onBack={() => props.navigation.goBack()}
      onContinue={(timeString: string) => {
        setUserData((prev: any) => ({ ...prev, knowsBirthTime: true, birthTime: timeString }));
        props.navigation.navigate('Relationship');
      }}
    />
  ), []);

  const RelationshipComponent = useMemo(() => (props: any) => (
    <RelationshipScreen
      onContinue={(status: any) => {
        setUserData((prev: any) => ({ ...prev, relationshipStatus: status }));
        props.navigation.navigate('Focus');
      }}
    />
  ), []);

  const FocusComponent = useMemo(() => (props: any) => (
    <FocusScreen
      onContinue={(focus: any) => {
        setUserData((prev: any) => ({ ...prev, focus }));
        props.navigation.navigate('Challenge');
      }}
    />
  ), []);

  const ChallengeComponent = useMemo(() => (props: any) => (
    <ChallengeScreen
      onContinue={(challenge: any) => {
        setUserData((prev: any) => ({ ...prev, challenge }));
        props.navigation.navigate('Expectations');
      }}
    />
  ), []);

  const ExpectationsComponent = useMemo(() => (props: any) => (
    <ExpectationsScreen
      onContinue={(expectations: any) => {
        setUserData((prev: any) => ({ ...prev, expectations }));
        props.navigation.navigate('Birthdate');
      }}
    />
  ), []);

  // No changes needed here, just for context range
  const BirthdateComponent = useMemo(() => (props: any) => (
    <BirthdateScreen
      onBack={() => props.navigation.goBack()}
      onContinue={(date: any) => {
        const fullData = { ...userDataRef.current, birthdate: date.toISOString() };
        setUserData(fullData);
        props.navigation.navigate('Calculating', { userData: fullData });
      }}
    />
  ), []);

  const hasPersistedData = useMemo(() => !!(userProfile && numerologyResults), [userProfile, numerologyResults]);
  const initialRouteName = hasPersistedData ? "MainTabs" : "Welcome";

  // Prepare params if we have persisted data
  const initialParams = useMemo(() => hasPersistedData ? {
    ...userProfile,
    ...(numerologyResults as any)
  } : undefined, [hasPersistedData, userProfile, numerologyResults]);

  if (isUserLoading || isRcLoading || !splashFinished || !ready) {
    return (
      <SplashScreen onFinish={() => setSplashFinished(true)} />
    );
  }

  return (
    <NavigationContainer ref={props.navigationRef}>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
        initialRouteName={initialRouteName}
      >
        <Stack.Screen name="Welcome" component={WelcomeComponent} />
        <Stack.Screen name="Language" component={LanguageComponent} />
        <Stack.Screen name="Identity" component={IdentityComponent} />
        <Stack.Screen name="Name" component={NameComponent} />
        <Stack.Screen name="BirthTime" component={BirthTimeComponent} />
        <Stack.Screen name="EnterBirthTime" component={EnterBirthTimeComponent} />
        <Stack.Screen name="Relationship" component={RelationshipComponent} />
        <Stack.Screen name="Focus" component={FocusComponent} />
        <Stack.Screen name="Challenge" component={ChallengeComponent} />
        <Stack.Screen name="Expectations" component={ExpectationsComponent} />
        <Stack.Screen name="Birthdate" component={BirthdateComponent} />
        <Stack.Screen name="AIConsent" component={AIConsentComponent} />
        <Stack.Screen name="Calculating" component={CalculatingScreenWrapper} />
        <Stack.Screen name="AnalysisComplete" component={AnalysisCompleteScreen} />
        <Stack.Screen name="ConnectionReading" component={ConnectionReadingScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsOfUse" component={TermsOfUseScreen} />
        <Stack.Screen name="Paywall" component={PaywallScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          initialParams={initialParams}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


import * as Notifications from 'expo-notifications';
import { configureNotificationHandler } from './src/utils/notifications';

configureNotificationHandler();

export default function App() {
  const navigationRef = React.useRef<any>(null);

  React.useEffect(() => {
    // Handle notification click
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      // Navigate to Home tab when notification is tapped
      if (navigationRef.current) {
        navigationRef.current.navigate('MainTabs', {
          screen: 'Home',
          params: { openDailyInsight: true }
        });
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RevenueCatProvider>
          <UserProvider>
            <VaultProvider>
              <SettingsProvider>
                <AppContent navigationRef={navigationRef} />
              </SettingsProvider>
            </VaultProvider>
          </UserProvider>
        </RevenueCatProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
