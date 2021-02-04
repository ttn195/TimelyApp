import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import AddEvent from "../screens/AddEventScreen";
import EditEvent from "../screens/EditEventScreen";
import NewGoal from "../screens/NewGoalScreen";
import PlanScreen from "../screens/PlanScreen";
import EditGoal from "../screens/EditGoalScreen";
import GoalDetail from "../screens/GoalDetailScreen";
import EventDetail from "../screens/EventDetailScreen";
import { PlanParamList } from "../types";

const PlanStack = createStackNavigator<PlanParamList>();

export default function PlanNavigator() {
  return (
    <PlanStack.Navigator>
      <PlanStack.Screen
        name="PlanScreen"
        component={PlanScreen}
        options={{
          headerTitle: "Plan"
        }}
      />
      <PlanStack.Screen
        name="NewEvent"
        component={AddEvent}
        options={{
          headerTitle: "New Event"
        }}
      />
      <PlanStack.Screen
        name="EditEvent"
        component={EditEvent}
        options={{
          headerTitle: "Edit Event"
        }}
      />

      <PlanStack.Screen
        name="NewGoal"
        component={NewGoal}
        options={{
          headerTitle: "New Goal"
        }}
      />
      <PlanStack.Screen
        name="EditGoal"
        component={EditGoal}
        options={{
          headerTitle: "Edit Goal"
        }}
      />
      <PlanStack.Screen
        name="GoalDetail"
        component={GoalDetail}
        options={{
          headerTitle: "Detail"
        }}
      />
      <PlanStack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{
          headerTitle: "Detail"
        }}
      />
    </PlanStack.Navigator>
  );
}
