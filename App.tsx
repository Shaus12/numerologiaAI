import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { InteractionManager, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RevenueCatProvider } from './src/context/RevenueCatContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from './src/navigation/types';
import { SplashScreen } from './src/screens/onboarding/SplashScreen';
import { WelcomeScreen } from './src/screens/onboarding/WelcomeScreen';
import { OnboardingFlowScreen } from './src/screens/onboarding/OnboardingFlowScreen';
import { LanguageScreen } from './src/screens/onboarding/LanguageScreen';
import { NameScreen } from './src/screens/onboarding/NameScreen';
import { IdentityScreen } from './src/screens/onboarding/IdentityScreen';
import { BirthdateScreen } from './src/screens/onboarding/BirthdateScreen';
import { FocusScreen } from './src/screens/onboarding/FocusScreen';
import { ChallengeScreen } from './src/screens/onboarding/ChallengeScreen';
import { AIConsentScreen } from './src/screens/onboarding/AIConsentScreen';
import { CalculatingScreen } from './src/screens/onboarding/CalculatingScreen';
import { LoadingAnalysisScreen } from './src/screens/onboarding/LoadingAnalysisScreen';
import { AnalysisScreen } from './src/screens/onboarding/AnalysisScreen';
import { AnalysisCompleteScreen } from './src/screens/onboarding/AnalysisCompleteScreen';
import { HomeScreen } from './src/screens/main/HomeScreen';
import { OracleScreen } from './src/screens/main/OracleScreen';
import { ForecastScreen } from './src/screens/main/ForecastScreen';
import { ProfileScreen } from './src/screens/main/ProfileScreen';
import { VaultScreen } from './src/screens/main/VaultScreen';
import { ConnectionReadingScreen } from './src/screens/main/ConnectionReadingScreen';
import { PaywallScreen } from './src/screens/main/PaywallScreen';
import { PhoneNumberEnergyScreen } from './src/screens/main/PhoneNumberEnergyScreen';
import { NameEnergyScreen } from './src/screens/main/NameEnergyScreen';
import { DateEnergyScreen } from './src/screens/main/DateEnergyScreen';
import { HomeEnergyScreen } from './src/screens/main/HomeEnergyScreen';
import { StatusBar } from 'expo-status-bar';
import { Colors } from './src/constants/Colors';
import { Home, Sparkles, LayoutGrid, User, Heart, Compass } from 'lucide-react-native';
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
import { PostHogProvider, usePostHog } from 'posthog-react-native';
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator({ route }: any) {
  const results = route.params || {};
  const insets = useSafeAreaInsets();
  const { language, t, isRTL } = useSettings();

  const tabLabel = (name: string) => {
    if (name === 'Home') return t('tabHome');
    if (name === 'Oracle') return t('tabOracle');
    if (name === 'Forecast') return t('tabForecast') || 'Forecast';
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
          else if (r.name === 'Forecast') icon = <Compass color={color} size={size} />;
          else if (r.name === 'Vault') icon = <Heart color={color} size={size} />;
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
      <Tab.Screen name="Vault" component={VaultScreen} />
      <Tab.Screen name="Forecast" component={ForecastScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={results}
      />
    </Tab.Navigator>
  );
}

const MainTabs = (props: any) => <MainTabNavigator {...props} />;

/**
 * PostHog's built-in screen autocapture calls useNavigationState above the stack (invalid on RN v7+).
 * We disable captureScreens on the provider and forward route changes here instead.
 */
function PostHogNavigationContainer({
    navigationRef,
    children,
}: {
    navigationRef: React.RefObject<any>;
    children: React.ReactNode;
}) {
    const posthog = usePostHog();

    const trackCurrentRoute = useCallback(() => {
        const nav = navigationRef.current;
        try {
            if (nav && typeof nav.isReady === 'function' && !nav.isReady()) return;
        } catch {
            return;
        }
        const route = nav?.getCurrentRoute?.();
        if (route?.name) {
            void posthog.screen(route.name, route.params);
        }
    }, [navigationRef, posthog]);

    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={trackCurrentRoute}
            onStateChange={trackCurrentRoute}
        >
            {children}
        </NavigationContainer>
    );
}

const CalculatingScreenWrapper = ({ route, navigation }: any) => {
  const { userData } = route.params || {};
  if (!userData) {
    if (typeof navigation?.replace === 'function') {
      navigation.replace('Welcome');
    }
    return null;
  }
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

  const { userProfile, numerologyResults, onboardingResume, isLoading: isUserLoading } = useUser();
  const { isLoading: isRcLoading, isPro } = useRevenueCat();
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
    <WelcomeScreen onStart={() => props.navigation.navigate('OnboardingFlow')} />
  ), []);

  const OnboardingFlowComponent = useMemo(
    () => (props: any) => <OnboardingFlowScreen navigation={props.navigation} />,
    [],
  );

  const LanguageComponent = useMemo(() => (props: any) => (
    <LanguageScreen
      onBack={() => {
        if (typeof props.navigation?.canGoBack === 'function' && props.navigation.canGoBack()) {
          props.navigation.goBack();
        } else {
          props.navigation.navigate('Welcome');
        }
      }}
      onContinue={(lang: any) => {
        setUserData((prev: any) => ({ ...prev, language: lang }));
        props.navigation.navigate('Name');
      }}
    />
  ), []);

  const NameComponent = useMemo(() => (props: any) => (
    <NameScreen
      onBack={() => props.navigation.navigate('Language')}
      onContinue={(name: string) => {
        setUserData((prev: any) => ({ ...prev, name }));
        props.navigation.navigate('Identity');
      }}
    />
  ), []);

  const IdentityComponent = useMemo(() => (props: any) => (
    <IdentityScreen
      onBack={() => props.navigation.navigate('Name')}
      onContinue={(identity: string) => {
        setUserData((prev: any) => ({ ...prev, identity }));
        props.navigation.navigate('Birthdate');
      }}
    />
  ), []);

  const BirthdateComponent = useMemo(() => (props: any) => (
    <BirthdateScreen
      onBack={() => props.navigation.navigate('Identity')}
      onContinue={(date: any) => {
        const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
        const birthdate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        setUserData((prev: any) => ({ ...prev, birthdate }));
        props.navigation.navigate('Focus');
      }}
    />
  ), []);

  const FocusComponent = useMemo(() => (props: any) => (
    <FocusScreen
      onBack={() => props.navigation.navigate('Birthdate')}
      onContinue={(focus: any) => {
        setUserData((prev: any) => ({ ...prev, focus }));
        props.navigation.navigate('Challenge');
      }}
    />
  ), []);

  const ChallengeComponent = useMemo(() => (props: any) => (
    <ChallengeScreen
      onBack={() => props.navigation.navigate('Focus')}
      onContinue={(challenge: any) => {
        const fullData = { ...userDataRef.current, challenge };
        setUserData(fullData);
        props.navigation.navigate('AIConsent', { userData: fullData });
      }}
    />
  ), []);

  const AIConsentComponent = useMemo(() => (props: any) => {
    const { userData: consentUserData } = (props.route.params || {}) as { userData?: any };
    return (
      <AIConsentScreen
        onBack={() => props.navigation.navigate('Challenge')}
        onContinue={() => {
          if (consentUserData) {
            props.navigation.navigate('Calculating', { userData: consentUserData });
          }
        }}
      />
    );
  }, []);

  const hasPersistedData = useMemo(() => !!(userProfile && numerologyResults), [userProfile, numerologyResults]);
  const initialRouteName = useMemo(() => {
    if (hasPersistedData) return 'MainTabs';
    if (onboardingResume.active && !isPro) return 'Paywall';
    return 'Welcome';
  }, [hasPersistedData, onboardingResume.active, isPro]);

  const paywallInitialParams = useMemo(
    () =>
      !hasPersistedData && onboardingResume.active && !isPro
        ? ({ variant: 'onboarding' } as const)
        : undefined,
    [hasPersistedData, onboardingResume.active, isPro],
  );

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
    <PostHogProvider
      apiKey="phc_G1OHDdBWXP8y3gY38h5Q4trJXLjTuKtd3WtYeDHf5yc"
      options={{ host: 'https://us.i.posthog.com' }}
      autocapture={{ captureScreens: false, captureTouches: false }}
    >
      <StatusBar style="light" />
      <PostHogNavigationContainer navigationRef={props.navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
          initialRouteName={initialRouteName}
        >
        <Stack.Screen name="Welcome" component={WelcomeComponent} />
        <Stack.Screen name="OnboardingFlow" component={OnboardingFlowComponent} />
        <Stack.Screen name="LoadingAnalysis" component={LoadingAnalysisScreen} />
        <Stack.Screen name="Analysis" component={AnalysisScreen} />
        <Stack.Screen name="Language" component={LanguageComponent} />
        <Stack.Screen name="Name" component={NameComponent} />
        <Stack.Screen name="Identity" component={IdentityComponent} />
        <Stack.Screen name="Birthdate" component={BirthdateComponent} />
        <Stack.Screen name="Focus" component={FocusComponent} />
        <Stack.Screen name="Challenge" component={ChallengeComponent} />
        <Stack.Screen name="AIConsent" component={AIConsentComponent} />
        <Stack.Screen name="Calculating" component={CalculatingScreenWrapper} />
        <Stack.Screen name="AnalysisComplete" component={AnalysisCompleteScreen} />
        <Stack.Screen name="ConnectionReading" component={ConnectionReadingScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsOfUse" component={TermsOfUseScreen} />
        <Stack.Screen
          name="Paywall"
          component={PaywallScreen}
          options={{ presentation: 'modal' }}
          {...(paywallInitialParams ? { initialParams: paywallInitialParams } : {})}
        />
        <Stack.Screen name="PhoneNumberEnergy" component={PhoneNumberEnergyScreen} />
        <Stack.Screen name="NameEnergy" component={NameEnergyScreen} />
        <Stack.Screen name="DateEnergy" component={DateEnergyScreen} />
        <Stack.Screen name="HomeEnergy" component={HomeEnergyScreen} />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          initialParams={initialParams}
        />
      </Stack.Navigator>
      </PostHogNavigationContainer>
    </PostHogProvider>
  );
};


import * as Notifications from 'expo-notifications';
import { configureNotificationHandler, type NotificationScreen } from './src/utils/notifications';
import { initializeMetaAppEvents } from './src/analytics/metaAppEvents';

configureNotificationHandler();

export default function App() {
  const navigationRef = React.useRef<any>(null);

  React.useEffect(() => {
    initializeMetaAppEvents();
  }, []);

  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      if (!navigationRef.current) return;

      const data = response.notification.request.content.data as {
        screen?: NotificationScreen;
        openDailyInsight?: boolean;
      };

      const target: NotificationScreen = data?.screen ?? 'Home';

      switch (target) {
        case 'Vault':
          navigationRef.current.navigate('MainTabs', { screen: 'Vault' });
          break;
        case 'Oracle':
          navigationRef.current.navigate('MainTabs', { screen: 'Oracle' });
          break;
        case 'Home':
        default:
          navigationRef.current.navigate('MainTabs', {
            screen: 'Home',
            params: { openDailyInsight: data?.openDailyInsight ?? false },
          });
          break;
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
                <View style={{ flex: 1 }}>
                  <AppContent navigationRef={navigationRef} />
                </View>
              </SettingsProvider>
            </VaultProvider>
          </UserProvider>
        </RevenueCatProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
