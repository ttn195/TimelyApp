import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EditPasswordScreen from '../screens/EditPasswordScreen';

import {
    ProfileParamList
} from '../types';

const ProfileStack = createStackNavigator<ProfileParamList>();

export default function ProfileNavigator() {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerTitle: 'Profile',
                }}
            />
            <ProfileStack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    headerTitle: 'Settings',
                }}
            />
            <ProfileStack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{
                    headerTitle: 'Edit Profile',
                }}
            />
            <ProfileStack.Screen
                name="EditPassword"
                component={EditPasswordScreen}
                options={{
                    headerTitle: 'Edit Password'
                }}
            />
        </ProfileStack.Navigator>
    );
}