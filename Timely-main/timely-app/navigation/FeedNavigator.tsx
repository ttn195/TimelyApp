import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import FeedScreen from "../screens/FeedScreen";
import { FeedParamList } from "../types";
import FollowingEventDetailScreen from "../screens/FollowingEventDetailScreen";
import FollowingGoalDetail from "../screens/GoalDetailScreen";
const FeedStack = createStackNavigator<FeedParamList>();

export default function FeedNavigator() {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          headerTitle: "Feed"
        }}
      />
      <FeedStack.Screen
        name="FollowingEventDetail"
        component={FollowingEventDetailScreen}
        options={{
          headerTitle: "Detail"
        }}
      />
      <FeedStack.Screen
        name="FollowingGoalDetail"
        component={FollowingGoalDetail}
        options={{
          headerTitle: "Detail"
        }}
      />
    </FeedStack.Navigator>
  );
}
