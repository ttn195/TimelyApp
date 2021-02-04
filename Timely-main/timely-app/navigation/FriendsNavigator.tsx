import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import FriendsScreen from "../screens/FriendsScreen";
import OtherProfileScreen from "../screens/OtherProfileScreen";
import { FriendsParamList } from "../types";

const FriendsStack = createStackNavigator<FriendsParamList>();

export default function FriendsNavigator() {
  return (
    <FriendsStack.Navigator>
      <FriendsStack.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          headerTitle: "Friends"
        }}
      />
      <FriendsStack.Screen
        name="ViewProfile"
        component={OtherProfileScreen}
        options={{
          headerTitle: "Profile"
        }}
      />
    </FriendsStack.Navigator>
  );
}
