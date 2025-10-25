import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../store/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import QuestsScreen from '../screens/QuestsScreen';
import NetworkScreen from '../screens/NetworkScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
    const { user } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    !user.onboarding_complete ? (
                        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    ) : (
                        <>
                            <Stack.Screen name="Dashboard" component={DashboardScreen} />
                            <Stack.Screen name="Profile" component={ProfileScreen} />
                            <Stack.Screen name="Quests" component={QuestsScreen} />
                            <Stack.Screen name="Network" component={NetworkScreen} />
                        </>
                    )
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
