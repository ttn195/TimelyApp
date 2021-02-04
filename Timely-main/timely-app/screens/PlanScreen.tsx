import * as React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import SelectPlan from "./PlanScreen/SelectPlan";
import EventsScreen from "./EventsScreen";
import GoalsScreen from "./GoalsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { PlanSelectParamList } from "../types";
import NewEventButton from "./PlanScreen/NewEventButton";

const PlanSelectStack = createStackNavigator<PlanSelectParamList>();

export default class PlanScreen extends React.Component<
  { route: any; navigation: any },
  { selected: string }
> {
  constructor(props) {
    super(props);
    this.state = {
      selected: "Events"
    };
    props.navigation.setOptions({
      headerRight: () => {
        return <NewEventButton selected={this.state.selected} {...props} />;
      }
    });
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(selected) {
    this.setState({ selected }, () => {
      this.props.navigation.navigate(selected);
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <SelectPlan onSelect={this.handleSelect} />
        <PlanSelectStack.Navigator>
          <PlanSelectStack.Screen name="Events" component={EventsScreen} />
          <PlanSelectStack.Screen name="Goals" component={GoalsScreen} />
        </PlanSelectStack.Navigator>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
  }
});
