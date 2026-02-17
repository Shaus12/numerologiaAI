import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
import { RelationshipScreen } from './src/screens/onboarding/RelationshipScreen';
import { FocusScreen } from './src/screens/onboarding/FocusScreen';
import { ChallengeScreen } from './src/screens/onboarding/ChallengeScreen';
import { ExpectationsScreen } from './src/screens/onboarding/ExpectationsScreen';
import { CalculatingScreen } from './src/screens/onboarding/CalculatingScreen';
import { AnalysisCompleteScreen } from './src/screens/onboarding/AnalysisCompleteScreen';
import { HomeScreen } from './src/screens/main/HomeScreen';
import { OracleScreen } from './src/screens/main/OracleScreen';
import { MatchScreen } from './src/screens/main/MatchScreen';
import { ProfileScreen } from './src/screens/main/ProfileScreen';
import { StatusBar } from 'expo-status-bar';
import { Colors } from './src/constants/Colors';
import { Home, Sparkles, Heart, User } from 'lucide-react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator({ route }: any) {
  const results = route.params;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0612',
          borderTopColor: 'rgba(255,255,255,0.05)',
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Home color={color} size={size} />;
          if (route.name === 'Oracle') return <Sparkles color={color} size={size} />;
          if (route.name === 'Match') return <Heart color={color} size={size} />;
          if (route.name === 'Profile') return <User color={color} size={size} />;
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
      <Tab.Screen
        name="Match"
        component={MatchScreen}
        initialParams={{ lifePath: results.lifePath, language: results.language }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={results}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [userData, setUserData] = useState<any>({});

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="Splash">
          {(props) => (
            <SplashScreen onFinish={() => props.navigation.replace('Welcome')} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Welcome">
          {(props) => (
            <WelcomeScreen onStart={() => props.navigation.navigate('Language')} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Language">
          {(props) => (
            <LanguageScreen
              onContinue={(lang) => {
                setUserData({ ...userData, language: lang });
                props.navigation.navigate('Identity');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Identity">
          {(props) => (
            <IdentityScreen
              onBack={() => props.navigation.goBack()}
              onContinue={(identity) => {
                setUserData({ ...userData, identity });
                props.navigation.navigate('Name');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Name">
          {(props) => (
            <NameScreen
              onBack={() => props.navigation.goBack()}
              onContinue={(name) => {
                setUserData({ ...userData, name });
                props.navigation.navigate('BirthTime');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="BirthTime">
          {(props) => (
            <BirthTimeScreen
              onContinue={(knowsTime) => {
                setUserData({ ...userData, knowsBirthTime: knowsTime });
                props.navigation.navigate('Relationship');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Relationship">
          {(props) => (
            <RelationshipScreen
              onContinue={(status) => {
                setUserData({ ...userData, relationshipStatus: status });
                props.navigation.navigate('Focus');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Focus">
          {(props) => (
            <FocusScreen
              onContinue={(focus) => {
                setUserData({ ...userData, focus });
                props.navigation.navigate('Challenge');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Challenge">
          {(props) => (
            <ChallengeScreen
              onContinue={(challenge) => {
                setUserData({ ...userData, challenge });
                props.navigation.navigate('Expectations');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Expectations">
          {(props) => (
            <ExpectationsScreen
              onContinue={(expectations) => {
                setUserData({ ...userData, expectations });
                props.navigation.navigate('Birthdate');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Birthdate">
          {(props) => (
            <BirthdateScreen
              onBack={() => props.navigation.goBack()}
              onContinue={(date) => {
                const updatedData = { ...userData, birthdate: date.toISOString() };
                setUserData(updatedData);
                props.navigation.navigate('Calculating');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Calculating">
          {(props) => (
            <CalculatingScreen
              userData={userData}
              onFinish={(results) => {
                props.navigation.replace('AnalysisComplete', results);
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="AnalysisComplete" component={AnalysisCompleteScreen} />

        <Stack.Screen name="MainTabs" component={MainTabNavigator} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
