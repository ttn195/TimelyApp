import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import SignInScreen from '../screens/SignInScreen'
import SignUpScreen from '../screens/SignUpScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider.js"

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {

  const { currentUser } = useContext(AuthContext);

  return (

    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      { currentUser ? <RootNavigator /> : <SignInNavigator />}
    </NavigationContainer>

  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}

const AuthStack = createStackNavigator();

function SignInNavigator() {
  return (

    <AuthStack.Navigator>
      <AuthStack.Screen name="SignIn" component={SignInScreen} options={{ title: "Sign In" }} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} options={{ title: "Sign Up" }} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{title: "Forgot Password" }} />
    </AuthStack.Navigator>

  );
}